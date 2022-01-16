import ApiModule from '../lib'

// import ApiModule from '../../dist'

// import ApiModule from '@no-996/axios-api'

import options from './options'

export default new ApiModule(
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
  }
)
