import ApiModule from '../lib'

// import ApiModule from '../../dist'

// import ApiModule from '@no-996/axios-api'

import options from './options'

const instance = new ApiModule(
  // 接口定义
  options,
  // axios配置
  {
    baseURL: 'https://jsonplaceholder.typicode.com',
    onUploadProgress: (progressEvent, percentCompleted) => {
      console.log(percentCompleted)
    },
  },
  // axios-api配置
  {
    cacheStorage: localStorage,
    debug: true,
    // 全局拦截器
    interceptors: {
      request: {
        onFulfilled: (config) => {
          debugger
          return config
        },
        onRejected: (error) => {
          return Promise.reject(error)
        },
      },
      response: {
        onFulfilled: (response) => {
          debugger
          return response.data
        },
        onRejected: (error) => {
          return Promise.reject(error)
        },
      },
    },
  }
)

export default instance
