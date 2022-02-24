import axios, { AxiosInstance, AxiosRequestConfig, CancelTokenSource, AxiosResponse } from 'axios'
import md5 from 'md5'
import { v4 as uuid } from 'uuid'
import Qs from 'qs'

/**
 * 避免调用someModule.request()出现语法错误Function不存在request
 * / Avoid Function dosen`t has request fuction when use someModule.request()
 */
declare global {
  interface Function {
    /**
     * 请求方法 / Request function
     * @returns
     */
    request(options: ApiModuleOptions): Promise<any>
  }
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
  /**
   * 是否显示调试日志
   * / show debug console
   */
  debug?: boolean
  /**
   * 全局拦截器
   * / axios interceptors(global)
   */
  interceptors?: {
    request?: {
      onFulfilled?: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>
      onRejected?: (error: any) => any
    }
    response?: {
      onFulfilled?: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
      onRejected?: (error: any) => any
    }
  }
  // TODO: 统一输出调试信息方法
}

interface CacheStorage {
  // 获取缓存
  getItem(key: string): string | null
  // 设置缓存
  setItem(key: string, value: string): void
}

interface BaseURL {
  (params: ApiModuleOptions): string | Promise<string>
}

interface ApiURLParams {
  [index: string]: any
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

/**
 * 参数元数据内容 / Params metadata info
 */
interface ApiMetadataItem {
  /**
   * 参数名
   * / field name
   */
  name: string
  /**
   * 参数描述
   * / field des
   */
  des: string
  // TODO: 参数校验
  /**
   * 参数类型
   * / field type
   */
  type?: string
  /**
   * 参数必填
   * / field required
   */
  required?: boolean
  /**
   * 自定义校验
   * / field validator
   */
  // validator?:
}

/**
 * 参数元数据 / Params metadata
 */
interface ApiMetadata {
  [index: string]: ApiMetadataItem | string
}

/**
 * Api模块配置
 * / Api module options
 */
interface ApiModuleOptions extends Omit<AxiosRequestConfig, 'baseURL' | 'onUploadProgress'> {
  /**
   * 扩展支持方法
   * / baseURL support function
   */
  baseURL?: string | BaseURL
  /**
   * 扩展返回百分比
   */
  onUploadProgress?: (progressEvent: any, percentCompleted: number) => void
  /**
   * 实例拦截器
   * / axios interceptors(instance)
   */
  interceptors?: {
    request?: {
      onFulfilled?: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>
      onRejected?: (error: any) => any
    }
    response?: {
      onFulfilled?: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
      onRejected?: (error: any) => any
    }
  }
  //
  /**
   * 接口名
   * / Api name
   */
  name?: string
  /**
   * 接口描述
   * / Api description
   */
  des?: string
  /**
   * 请求中断方式：previous、current
   * / Cancel type: previous、current
   */
  cancel?: string | null
  /**
   * 缓存开关与间隔时长，缓存key为请求参数的md5值
   * / Cache timeout, cache key base on the md5 value of params and data
   */
  cache?: number | null
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
  /**
   * 是否仅返回处理后的url，如返回文件url路径
   * / Return the parsed url only
   */
  urlOnly?: boolean
  /**
   * 替换url中的参数
   * / Params for url replace
   */
  urlParams?: ApiURLParams
  //
  [index: string]: any
}

interface ParamsSerializer {
  (params: any): string
}

const OptionsSymbol = Symbol('options')
const ConfigSymbol = Symbol('config')
const OptionsPathSymbol = Symbol('optionsPath')
const CancelKeySymbol = Symbol('cancelKey')
const CancelRecordsSymbol = Symbol('cancelRecords')
const CacheRecordsSymbol = Symbol('cacheRecords')
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
   * Api配置 / Api config
   */
  readonly [ConfigSymbol]: ApiModuleConfig;
  /**
   * Api模块配置 / Api module options
   */
  readonly [OptionsSymbol]: ApiModuleOptions;
  /**
   * Api模块配置路径 / Api module options path
   */

  readonly [OptionsPathSymbol]: string;
  /**
   * 取消用唯一码 / Cancel key
   */
  readonly [CancelKeySymbol]: string;
  /**
   * 取消用唯一码记录 / Cancel key records
   */
  readonly [CancelRecordsSymbol]: Array<CancelRecord>;
  /**
   * 缓存记录 / Cache records
   */
  readonly [CacheRecordsSymbol]: Array<CacheRecord>
  /**
   * Axios 实例 / Axios instance
   */
  readonly axiosInstance: AxiosInstance
  /**
   * 参数处理方法 / paramsSerializer
   * @param params
   */
  paramsSerializer(url: string, params: any, func?: ParamsSerializer) {
    let query = ''
    try {
      if (typeof func == 'function') {
        query = func(params) || ''
      } else {
        query = Qs.stringify(params, { arrayFormat: 'brackets' })
      }
    } catch (e) {
      console.error(e)
    }
    // 是否已经有参数
    if (/\?[^?#]*$/.test(url)) {
      if (/[&?]$/.test(url)) {
        return url + query
      } else {
        return url + (query ? `&${query}` : '')
      }
    } else {
      return url + (query ? `?${query}` : '')
    }
  }

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
    }
    // 运行时参数
    Object.keys(options).forEach((o) => {
      if (typeof options[o] === 'object' && typeof optionsMix[o] === 'object') {
        optionsMix[o] = {
          ...optionsMix[o],
          ...options[o],
        }
      } else {
        optionsMix[o] = options[o]
      }
    })

    // URL转换
    optionsMix.url = this.parseURL(optionsMix)
    // baseURL处理
    try {
      if (optionsMix.baseURL) {
        if (typeof optionsMix.baseURL === 'function') {
          optionsMix.baseURL = await optionsMix.baseURL(optionsMix)
        }
      }
    } catch (e) {
      console.error(e)
    }

    if (optionsMix.urlOnly) {
      // 直接返回URL，包含params参数转化的query
      return this.paramsSerializer(optionsMix.url, optionsMix.params, optionsMix.paramsSerializer)
    } else {
      return new Promise((resolve, reject) => {
        const source = CancelToken.source()
        const id = uuid()

        this[ConfigSymbol].debug && console.log(`%crequest / %c${this[OptionsPathSymbol]} / %c${id}`, 'color:blue', 'color:orange', 'color:purple')

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
          let targets = this[CacheRecordsSymbol].filter((o) => o.expires < now)
            .map((value, index) => ({ value, index }))
            .reverse()
          targets.forEach((o) => {
            // 移除记录
            this[CacheRecordsSymbol].splice(o.index, 1)
          })
          // 查找有效缓存
          let index = this[CacheRecordsSymbol].findIndex((o) => o.key === cacheKey)
          if (index > -1) {
            cacheRecord = this[CacheRecordsSymbol][index]
          }
        }
        if (cacheRecord !== null) {
          // 返回缓存记录
          resolve(cacheRecord.data)
        } else {
          // 请求
          this.axiosInstance
            .request({
              ...optionsMix,
              cancelToken: optionsMix.cancel ? source.token : optionsMix.cancelToken,
              // 增加百分比输出（2位小数）
              onUploadProgress: (progressEvent) => {
                let percentCompleted = 0
                try {
                  // 计算百分比
                  percentCompleted = Math.round(((progressEvent.loaded * 100) / progressEvent.total) * 100) / 100
                } catch (e) {
                  console.error(e)
                }
                try {
                  if (optionsMix.onUploadProgress) {
                    optionsMix.onUploadProgress(progressEvent, percentCompleted)
                  }
                } catch (e) {
                  console.error(e)
                }
              },
            } as AxiosRequestConfig)
            .then((res) => {
              if (optionsMix.cancel) {
                let index = this[CancelRecordsSymbol].findIndex((o) => o.id === id)
                if (index > -1) {
                  this[CancelRecordsSymbol].splice(index, 1)
                }
              }

              this[ConfigSymbol].debug &&
                console.log(`%csuccess / %c${this[OptionsPathSymbol]} / %c${id}`, 'color:green', 'color:orange', 'color:purple')

              // 记录缓存
              if (optionsMix.cache && optionsMix.cache > 0 && cacheKey) {
                // 有效时长、有效key
                this[CacheRecordsSymbol].push({
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
                let index = this[CancelRecordsSymbol].findIndex((o) => o.id === id)
                if (index > -1) {
                  this[CancelRecordsSymbol].splice(index, 1)
                }
              }

              this[ConfigSymbol].debug && console.log(`%cfail / %c${this[OptionsPathSymbol]} / %c${id}`, 'color:red', 'color:orange', 'color:purple')
              reject(e)
            })
          if (optionsMix.cancel) {
            // 开启cancel功能
            if (optionsMix.cancel === 'current') {
              // 取消当前的
              if (this[CancelRecordsSymbol].findIndex((o) => o.key === this[CancelKeySymbol]) > -1) {
                source.cancel(`${this[OptionsPathSymbol]} / ${id}`)
              } else {
                this[CancelRecordsSymbol].push({ key: this[CancelKeySymbol], source, id })
              }
            } else if (optionsMix.cancel === 'previous') {
              // 取消之前的
              let targets = this[CancelRecordsSymbol].filter((o) => o.key === this[CancelKeySymbol])
                .map((value, index) => ({ value, index }))
                .reverse()
              targets.forEach((o) => {
                o.value.source.cancel(`${this[OptionsPathSymbol]} / ${id}`)
                // 移除记录
                this[CancelRecordsSymbol].splice(o.index, 1)
              })
              this[CancelRecordsSymbol].push({ key: this[CancelKeySymbol], source, id })
            }
          }
        }
      })
    }
  }

  /**
   * 处理URL参数 / Parse URL params
   */
  parseURL(options: ApiModuleOptions): string {
    let url = options.url || ''
    if (options.urlParams) {
      const inject = /{[^{}]+}/.test(url)
      // 参数替换（取params首层）
      if (inject) {
        let placements = url.match(/{([^{}]+)}/g)
        if (placements) {
          let keys = placements.map((o) => o.replace(/[{}]/g, ''))
          keys.forEach((k) => {
            if (options.urlParams) {
              let value = options.urlParams[k]
              if (typeof value !== 'undefined') {
                let reg = new RegExp(`{${k}}`)
                url = url.replace(reg, value.toString())
              }
            }
          })
        }
      }
    }
    return url
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
    // Api配置
    this[ConfigSymbol] = apiModuleConfig

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
    this[OptionsPathSymbol] = parseNamePath(this[OptionsSymbol])

    // 初始化取消记录
    this[CancelRecordsSymbol] = info && info.cancelRecords ? info.cancelRecords : []
    // 生成取消用的唯一码
    this[CancelKeySymbol] = md5(this[OptionsPathSymbol])

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
    this[CacheRecordsSymbol] = new Proxy(cacheDefault, {
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
        if (opts.name) {
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
          this[opts.name] = new ApiModule(opts.children, config, this[ConfigSymbol], {
            option: opts,
            cancelRecords: this[CancelRecordsSymbol],
            cacheRecords: this[CacheRecordsSymbol],
          })
        }
      }
    }
    // Axios实例
    this.axiosInstance = axios.create(config)
    // 全局拦截器
    if (apiModuleConfig) {
      let interceptors = apiModuleConfig.interceptors
      if (info && info.option && info.option.interceptors) {
        interceptors = info.option.interceptors
      }
      if (interceptors) {
        if (interceptors.request) {
          const onFulfilled = interceptors.request.onFulfilled || ((value: AxiosRequestConfig) => {})
          const onRejected = interceptors.request.onRejected || ((error: any) => {})
          this.axiosInstance.interceptors.request.use(onFulfilled, onRejected)
        }
        if (interceptors.response) {
          const onFulfilled = interceptors.response.onFulfilled || ((value: AxiosResponse) => {})
          const onRejected = interceptors.response.onRejected || ((error: any) => {})
          this.axiosInstance.interceptors.response.use(onFulfilled, onRejected)
        }
      }
    }
  }
  [index: string]: ApiModule | Function
}

export default ApiModule

export { ApiModuleOptions }
