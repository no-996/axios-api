import { ApiModule } from '../lib/axios-api'

import options from './options'

console.log(JSON.stringify(options, null, 2))

export default new ApiModule(
  options,
  {
    baseURL: 'https://jsonplaceholder.typicode.com',
    onUploadProgress: (progressEvent, percentCompleted) => {
      console.log(percentCompleted)
    },
  },
  {
    cacheStorage: localStorage,
    debug: true,
  }
)
