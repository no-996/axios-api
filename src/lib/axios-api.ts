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
 * 取消用唯一码记录 / Cancel key records
 */
interface CancelKeyRecord {
  // 取消用唯一码 / Cancel key
  key: string
  source: CancelTokenSource
  id: string
}

const OptionsSymbol = Symbol('options')
const AxiosInstanceSymbol = Symbol('axiosInstance')
const OptionsPath = Symbol('optionsPath')
const CancelKey = Symbol('cancelKey')
const CancelKeyRecords = Symbol('CancelKeyRecords')
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
  readonly [CancelKeyRecords]: Array<CancelKeyRecord>;
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

      this[AxiosInstanceSymbol].request({
        ...optionsMix,
        cancelToken: source.token,
      })
        .then((res) => {
          let index = this[CancelKeyRecords].findIndex((o) => o.id === id)
          if (index > -1) {
            this[CancelKeyRecords].splice(index, 1)
          }

          console.log(`%csuccess / %c${this[OptionsPath]} / %c${id}`, 'color:green', 'color:orange', 'color:purple')
          resolve(res)
        })
        .catch((e) => {
          // if (!axios.isCancel(e)) {
          // }
          let index = this[CancelKeyRecords].findIndex((o) => o.id === id)
          if (index > -1) {
            this[CancelKeyRecords].splice(index, 1)
          }

          console.log(`%cfail / %c${this[OptionsPath]} / %c${id}`, 'color:red', 'color:orange', 'color:purple')
          reject(e)
        })
      if (optionsMix.cancel) {
        // 开启cancel功能
        if (optionsMix.cancel === 'current') {
          // 取消当前的
          if (this[CancelKeyRecords].findIndex((o) => o.key === this[CancelKey]) > -1) {
            source.cancel(`${this[OptionsPath]} / ${id}`)
          } else {
            this[CancelKeyRecords].push({ key: this[CancelKey], source, id })
          }
        } else if (optionsMix.cancel === 'previous') {
          // 取消之前的
          let exists = this[CancelKeyRecords].filter((o) => o.key === this[CancelKey])
          exists.forEach((o) => {
            o.source.cancel(`${this[OptionsPath]} / ${id}`)
            // 移除记录
            let index = this[CancelKeyRecords].findIndex((t) => t.key === o.key)
            this[CancelKeyRecords].splice(index, 1)
          })
          this[CancelKeyRecords].push({ key: this[CancelKey], source, id })
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
    info?: {
      option?: ApiModuleOptions
      cancelKeyRecords?: Array<CancelKeyRecord>
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
    // 初始化取消唯一码记录
    this[CancelKeyRecords] = info && info.cancelKeyRecords ? info.cancelKeyRecords : []

    // 生成取消用的唯一码
    this[CancelKey] = md5(this[OptionsPath])

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
        this[opts.name] = new ApiModule(opts.children, config, { option: opts, cancelKeyRecords: this[CancelKeyRecords] })
      }
    }
    // Axios实例
    this[AxiosInstanceSymbol] = axios.create(config)
  }
  [index: string]: ApiModule | Function
}

export { ApiModule, ApiModuleOptions }