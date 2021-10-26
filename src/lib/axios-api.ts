import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

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

  metadata?: ApiMetadata
}

const OptionsSymbol = Symbol('options')
const AxiosInstanceSymbol = Symbol('axiosInstance')

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
    let config = {
      ...this[OptionsSymbol],
      name: undefined,
      cancel: undefined,
      cache: undefined,
      parseURL: undefined,
    }
    const res = await this[AxiosInstanceSymbol].request(config)
    return res
  }
  /**
   * Api模块
   * / Api module
   * @param options Api模块配置 / Api module options
   */
  constructor(options: ApiModuleOptions, config?: AxiosRequestConfig) {
    if (!options || typeof options !== 'object') {
      throw new Error('ApiModule -> constructor -> options must be an object.')
    }
    if (typeof options.name !== 'string' || options.name === '' || /\s/.test(options.name)) {
      throw new Error('ApiModule -> constructor -> options.name must be a nonempty string without empty char')
    }
    this[OptionsSymbol] = {
      name: options.name,
      des: options.des || options.name,
      url: options.url,
      cancel: options.cancel || null,
      cache: options.cache || null,
      parseURL: options.parseURL || false,
      children: options.children || [],
    }
    this[AxiosInstanceSymbol] = axios.create(config || {})
    const optionsCopy = this[OptionsSymbol]
    if (optionsCopy.children) {
      const keys = Object.keys(this).concat([
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
      for (let i = 0; i < optionsCopy.children.length; i++) {
        let opts = optionsCopy.children[i]
        if (keys.includes(opts.name)) {
          throw new Error(`ApiModule -> constructor -> options.name can\`t be ${keys.map((o) => `"${o}"`).join('/')}.`)
        } else if (/^__/.test(opts.name) || /__$/.test(opts.name)) {
          throw new Error(`ApiModule -> constructor -> options.name is invalid.`)
        }
        this[opts.name] = new ApiModule(opts, config)
      }
    }
  }
  [index: string]: ApiModule | Function
}

export { ApiModule, ApiModuleOptions }
