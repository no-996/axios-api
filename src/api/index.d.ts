import { ApiModule, ApiModuleOptions } from '../ApiModule'

/* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ root ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */

/**
 * 根模块
 */
interface RootInstance {
  /**
   * 人类
   * - url: /1
   */
  human: HumanInstance
  /**
   * annimal
   * - url: /2
   */
  annimal: AnnimalInstance
  /**
   * str required
   * - url: /
   */
  strRequired: StrRequiredInstance
  /**
   * str array
   * - url: /
   */
  strArray: StrArrayInstance
  /**
   * obj required
   * - url: /
   */
  objRequired: ObjRequiredInstance
  /**
   * 请求方法 / Request function
   *
   */
  request(options: ApiModuleOptions): Promise<any>
}

/* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ root.human ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */

/**
 * 人类
 * - url: /1
 */
interface HumanInstance {
  /**
   * 请求方法 / Request function
   * - url: /1
   *
   * ```
   * // 默认请求参数
   * // default request data
   * {
   *   "data": {
   *     "a": "1",
   *     "b": 2,
   *     "f": [
   *       2,
   *       3,
   *       4
   *     ],
   *     "g": [
   *       {
   *         "x": 1,
   *         "y": "2"
   *       }
   *     ]
   *   },
   *   "params": {
   *     "c": 3,
   *     "d": {
   *       "e": 4,
   *       "f": 5
   *     }
   *   }
   * }
   * ```
   */
  request(options: {
    data?: {
      /**
       * 参数a
       * - 参数a的描述
       */
      a: string
      /**
       * 参数f
       * - 参数f的描述
       */
      f?: number[]
      /**
       * 参数g
       * - 参数g的描述
       */
      g?: {
        /**
         * 参数x
         * - 参数x的描述
         */
        x?: number
        /**
         * 参数y
         * - 参数y的描述
         */
        y?: string
      }[]
    }
    params?: {
      /**
       * 参数c
       */
      c?: number
      /**
       * 参数d
       */
      d?: {
        /**
         * 参数e
         */
        e?: number
        /**
         * 参数f
         */
        f?: number
      }
    }
  }): Promise<any>
}

/* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ root.human ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */

/* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ root.annimal ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */

/**
 * annimal
 * - url: /2
 */
interface AnnimalInstance {
  /**
   * 狗
   */
  dog: DogInstance
  /**
   * 猫
   * - url: /5
   */
  cat: CatInstance
  /**
   * 请求方法 / Request function
   * - url: /2
   *
   * ```
   * // 默认请求参数
   * // default request data
   * {
   *   "data": {
   *     "x": [
   *       1,
   *       2
   *     ],
   *     "y": [
   *       {
   *         "a": 1,
   *         "b": "2"
   *       },
   *       {
   *         "a": 3,
   *         "b": "4"
   *       }
   *     ]
   *   }
   * }
   * ```
   */
  request(options: { data: any }): Promise<any>
}

/* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ root.annimal.dog ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */

/**
 * 狗
 */
interface DogInstance {
  /**
   * 金毛
   * - url: /3
   */
  golden: GoldenInstance
  /**
   * 泰迪
   * - url: /4
   */
  teddy: TeddyInstance
  /**
   * 请求方法 / Request function
   *
   */
  request(options: ApiModuleOptions): Promise<any>
}

/* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ root.annimal.dog.golden ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */

/**
 * 金毛
 * - url: /3
 */
interface GoldenInstance {
  /**
   * 请求方法 / Request function
   * - url: /3
   *
   */
  request(options: ApiModuleOptions): Promise<any>
}

/* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ root.annimal.dog.golden ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */

/* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ root.annimal.dog.teddy ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */

/**
 * 泰迪
 * - url: /4
 */
interface TeddyInstance {
  /**
   * 请求方法 / Request function
   * - url: /4
   *
   */
  request(options: ApiModuleOptions): Promise<any>
}

/* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ root.annimal.dog.teddy ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */

/* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ root.annimal.dog ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */

/* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ root.annimal.cat ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */

/**
 * 猫
 * - url: /5
 */
interface CatInstance {
  /**
   * 请求方法 / Request function
   * - url: /5
   *
   */
  request(options: ApiModuleOptions): Promise<any>
}

/* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ root.annimal.cat ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */

/* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ root.annimal ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */

/* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ root.strRequired ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */

/**
 * str required
 * - url: /
 */
interface StrRequiredInstance {
  /**
   * 请求方法 / Request function
   * - url: /
   *
   */
  request(options: {
    /**
     * 参数data
     * - 参数data的描述
     */
    data: string
  }): Promise<any>
}

/* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ root.strRequired ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */

/* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ root.strArray ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */

/**
 * str array
 * - url: /
 */
interface StrArrayInstance {
  /**
   * 请求方法 / Request function
   * - url: /
   *
   * ```
   * // 默认请求参数
   * // default request data
   * {
   *   "data": []
   * }
   * ```
   */
  request(options: {
    /**
     * 参数data
     * - 参数data的描述
     */
    data?: string[]
  }): Promise<any>
}

/* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ root.strArray ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */

/* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ root.objRequired ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */

/**
 * obj required
 * - url: /
 */
interface ObjRequiredInstance {
  /**
   * 请求方法 / Request function
   * - url: /
   *
   * ```
   * // 默认请求参数
   * // default request data
   * {
   *   "data": {
   *     "a": 9
   *   }
   * }
   * ```
   */
  request(options: {
    /**
     * 参数data的描述
     */
    data: {
      /**
       * name a
       */
      a?: string
      /**
       * name b
       */
      b?: number
    }
  }): Promise<any>
}

/* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ root.objRequired ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */

/* ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ root ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ */

/**
 * 根模块
 */
declare const instance: RootInstance
export default instance
