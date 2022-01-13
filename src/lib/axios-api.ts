import axios, { AxiosInstance, AxiosRequestConfig, CancelTokenSource } from 'axios'
import md5 from 'md5'
import { v4 as uuid } from 'uuid'

interface ApiMetadataItem {
  name: string
  type?: string
  required?: boolean
  // validator?:
}

interface ApiMetadata {
  [index: string]: ApiMetadataItem | string
}

interface CacheStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

/**
 * Api模块配置
 * / Api module options
 */
interface ApiModuleOptions extends AxiosRequestConfig {
  /**
   * 接口名
   * / Api name
   */
  name: string
  /**
   * 接口描述
   * / Api description
   */
  des?: string
  /**
   * 请求中断方式：previous、current、自定义
   * / Cancel type: previous、current、custom
   */
  cancel?: string | null
  /**
   * 缓存开关与间隔时长，缓存key为请求参数的md5值
   * / Cache timeout, cache key base on the md5 value of params and data
   */
  cache?: number | null
  /**
   * 是否仅返回处理后的url，如返回文件url路径
   * / Return the parsed url only
   */
  parseURL?: boolean
  /**
   * 子模块
   * / Sub modules
   */
  children?: ApiModuleOptions[]
  /**
   * 接口描述
   * / Api metadata
   */
  metadata?: ApiMetadata
  /**
   * 父模块
   * / Parent modules
   */
  parent?: ApiModuleOptions
}

/**
 * Api配置
 * / Api config
 */
interface ApiModuleConfig {
  /**
   * 缓存工具
   * / Cache storage
   */
  cacheStorage?: CacheStorage
}

/**
 * 取消记录 / Cancel records
 */
interface CancelRecord {
  id: string
  // 取消用唯一码 / Cancel key
  key: string
  source: CancelTokenSource
}

/**
 * 缓存记录 / Cache records
 */
interface CacheRecord {
  id: string
  // 缓存唯一码 / Cache key
  key: string
  data?: any
  expires: number
}

const OptionsSymbol = Symbol('options')
const AxiosInstanceSymbol = Symbol('axiosInstance')
const OptionsPath = Symbol('optionsPath')
const CancelKey = Symbol('cancelKey')
const CancelRecords = Symbol('CancelRecords')
const CacheRecords = Symbol('CacheRecords')
const CancelToken = axios.CancelToken
// 生成路径
function parseNamePath(option: ApiModuleOptions): string {
  let paths = []
  let current = option
  while (current) {
    paths.push(current.name)
    if (current.parent) {
      current = current.parent
    } else {
      break
    }
  }
  return paths.reverse().join('->')
}

/**
 * Api模块
 * / Api module
 */
class ApiModule {
  /**
   * Api模块配置 / Api module options
   */
  readonly [OptionsSymbol]: ApiModuleOptions;
  /**
   * Api模块配置路径 / Api module options path
   */

  readonly [OptionsPath]: string;
  /**
   * 取消用唯一码 / Cancel key
   */
  readonly [CancelKey]: string;
  /**
   * 取消用唯一码记录 / Cancel key records
   */
  readonly [CancelRecords]: Array<CancelRecord>;
  /**
   * 缓存记录 / Cache records
   */
  readonly [CacheRecords]: Array<CacheRecord>;
  /**
   * Axios 实例 / Axios instance
   */
  readonly [AxiosInstanceSymbol]: AxiosInstance

  /**
   * 请求方法 / Request function
   * @returns
   */
  async request(options: ApiModuleOptions): Promise<any> {
    if (!this[OptionsSymbol].url) {
      throw new Error('ApiModule -> constructor -> options.url is empty, can`t request that.')
    }
    let optionsMix = {
      // 配置时参数
      ...this[OptionsSymbol],
      // 运行时参数
      ...options,
    }

    return new Promise((resolve, reject) => {
      const source = CancelToken.source()
      const id = uuid()
      console.log(`%crequest / %c${this[OptionsPath]} / %c${id}`, 'color:blue', 'color:orange', 'color:purple')

      let cacheKey = ''
      let cacheRecord = null

      try {
        cacheKey = md5(
          JSON.stringify({
            url: optionsMix.url,
            baseURL: optionsMix.baseURL,
            method: optionsMix.method,
            headers: optionsMix.headers,
            data: optionsMix.data,
            params: optionsMix.params,
            auth: optionsMix.auth,
            //
            name: optionsMix.name,
          })
        )
      } catch (e) {
        console.error(e)
      }

      if (optionsMix.cache) {
        // 清除过期缓存
        let now = Date.now()
        let targets = this[CacheRecords].filter((o) => o.expires < now)
          .map((value, index) => ({ value, index }))
          .reverse()
        targets.forEach((o) => {
          // 移除记录
          this[CacheRecords].splice(o.index, 1)
        })
        // 查找有效缓存
        let index = this[CacheRecords].findIndex((o) => o.key === cacheKey)
        if (index > -1) {
          cacheRecord = this[CacheRecords][index]
        }
      }
      if (cacheRecord !== null) {
        resolve(cacheRecord.data)
      } else {
        this[AxiosInstanceSymbol].request({
          ...optionsMix,
          cancelToken: optionsMix.cancel ? source.token : optionsMix.cancelToken,
        })
          .then((res) => {
            if (optionsMix.cancel) {
              let index = this[CancelRecords].findIndex((o) => o.id === id)
              if (index > -1) {
                this[CancelRecords].splice(index, 1)
              }
            }

            console.log(`%csuccess / %c${this[OptionsPath]} / %c${id}`, 'color:green', 'color:orange', 'color:purple')

            // 记录缓存
            if (optionsMix.cache && optionsMix.cache > 0 && cacheKey) {
              // 有效时长、有效key
              this[CacheRecords].push({
                id,
                key: cacheKey,
                data: {
                  ...res,
                  config: {
                    ...res.config,
                    // 去除冗余数据
                    cacheRecords: undefined,
                    cacheStorage: undefined,
                    children: undefined,
                    parent: undefined,
                  },
                },
                expires: Date.now() + optionsMix.cache,
              })
            }
            resolve(res)
          })
          .catch((e) => {
            // if (!axios.isCancel(e)) {
            // }
            if (optionsMix.cancel) {
              let index = this[CancelRecords].findIndex((o) => o.id === id)
              if (index > -1) {
                this[CancelRecords].splice(index, 1)
              }
            }

            console.log(`%cfail / %c${this[OptionsPath]} / %c${id}`, 'color:red', 'color:orange', 'color:purple')
            reject(e)
          })
        if (optionsMix.cancel) {
          // 开启cancel功能
          if (optionsMix.cancel === 'current') {
            // 取消当前的
            if (this[CancelRecords].findIndex((o) => o.key === this[CancelKey]) > -1) {
              source.cancel(`${this[OptionsPath]} / ${id}`)
            } else {
              this[CancelRecords].push({ key: this[CancelKey], source, id })
            }
          } else if (optionsMix.cancel === 'previous') {
            // 取消之前的
            let targets = this[CancelRecords].filter((o) => o.key === this[CancelKey])
              .map((value, index) => ({ value, index }))
              .reverse()
            targets.forEach((o) => {
              o.value.source.cancel(`${this[OptionsPath]} / ${id}`)
              // 移除记录
              this[CancelRecords].splice(o.index, 1)
            })
            this[CancelRecords].push({ key: this[CancelKey], source, id })
          }
        }
      }
    })
  }
  /**
   * Api模块
   * / Api module
   * @param options Api模块配置 / Api module options
   * @param config Axios配置 / Axios config
   */
  constructor(
    options: ApiModuleOptions[] = [],
    config: AxiosRequestConfig = {},
    apiModuleConfig: ApiModuleConfig = {},
    info?: {
      option?: ApiModuleOptions
      cancelRecords?: Array<CancelRecord>
      cacheRecords?: Array<CacheRecord>
    }
  ) {
    // Api模块配置
    this[OptionsSymbol] =
      info && info.option
        ? info.option
        : {
            // 补充根模块
            name: 'root',
            des: '根模块/root module',
            children: options,
          }

    // 生成路径
    this[OptionsPath] = parseNamePath(this[OptionsSymbol])

    // 初始化取消记录
    this[CancelRecords] = info && info.cancelRecords ? info.cancelRecords : []
    // 生成取消用的唯一码
    this[CancelKey] = md5(this[OptionsPath])

    // 初始化缓存记录
    let cacheDefault: Array<CacheRecord> = []
    if (apiModuleConfig.cacheStorage) {
      try {
        // 恢复缓存记录
        cacheDefault = JSON.parse(apiModuleConfig.cacheStorage.getItem('axios-api-cache') as string) || []
      } catch (e) {
        console.error(e)
      }
    }
    //
    cacheDefault = info && info.cacheRecords ? info.cacheRecords : cacheDefault
    this[CacheRecords] = new Proxy(cacheDefault, {
      get(target, key) {
        return target[key as any]
      },
      set(target, key, value) {
        target[key as any] = value
        if (apiModuleConfig.cacheStorage) {
          try {
            apiModuleConfig.cacheStorage.setItem('axios-api-cache', JSON.stringify(target))
          } catch (e) {
            console.error(e)
          }
        }
        return true
      },
    })

    // 保留字段
    const ReservedField = Object.keys(this).concat([
      'constructor',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toLocaleString',
      'toString',
      'valueOf',
      //
      'this',
      'request',
    ])
    const OptionsCopy = this[OptionsSymbol]

    if (Array.isArray(OptionsCopy.children)) {
      let names = OptionsCopy.children.map((o) => o.name)
      for (let i = 0; i < OptionsCopy.children.length; i++) {
        let opts = OptionsCopy.children[i]
        opts.parent = OptionsCopy
        if (ReservedField.includes(opts.name)) {
          // 保留字段校验
          throw new Error(`ApiModule -> constructor -> options.name can\`t be ${ReservedField.map((o) => `"${o}"`).join('/')}.`)
        } else if (/^__/.test(opts.name) || /__$/.test(opts.name)) {
          // 特殊字段校验
          throw new Error(`ApiModule -> constructor -> options.name is invalid.`)
        } else if (names.filter((o) => o === opts.name).length > 1) {
          // 重复命名
          throw new Error(`ApiModule -> constructor -> options.name of '${opts.name}' is duplicate.`)
        }

        // 接口实例
        this[opts.name] = new ApiModule(opts.children, config, apiModuleConfig, {
          option: opts,
          cancelRecords: this[CancelRecords],
          cacheRecords: this[CacheRecords],
        })
      }
    }
    // Axios实例
    this[AxiosInstanceSymbol] = axios.create(config)
  }
  [index: string]: ApiModule | Function
}

export { ApiModule, ApiModuleOptions }
