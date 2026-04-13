import axios from 'axios'
import { OPEN_API_URL } from '@env'

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
    '🧑🏻‍💻 Request Interceptor | Authorization: ',
    config.headers.Authorization
  )
  console.log(
    '🧑🏻‍💻 Request Interceptor | Content-Type: ',
    config.headers['Content-Type']
  )
  console.log('🧑🏻‍💻 Request Interceptor | Request params:', config.params)
  console.log('🧑🏻‍💻 Request Interceptor | Request body:', config.data)

  return config
})
