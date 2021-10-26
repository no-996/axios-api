import { ApiModule } from '../lib/axios-api'

import config from './config'

console.log(JSON.stringify(config, null, 2))

export default new ApiModule(config, {
  baseURL: 'https://jsonplaceholder.typicode.com',
})
