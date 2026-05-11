import axios from 'axios'
import { OPEN_API_URL } from '@env'
import { redactBodyForLog, redactNetworkRecord } from './debugLog'

export const openApiAxiosClient = axios.create({
  baseURL: OPEN_API_URL,
  timeout: 10000,
})

openApiAxiosClient.interceptors.request.use(config => {
  if (!__DEV__) {
    return config
  }

  console.log('🧑🏻‍💻 Request Interceptor | Request URL:', config.url)
  console.log(
    '🧑🏻‍💻 Request Interceptor | Headers:',
    redactNetworkRecord(config.headers)
  )
  console.log(
    '🧑🏻‍💻 Request Interceptor | Request params:',
    redactNetworkRecord(config.params)
  )
  console.log(
    '🧑🏻‍💻 Request Interceptor | Request body:',
    redactBodyForLog(config.data)
  )

  return config
})
