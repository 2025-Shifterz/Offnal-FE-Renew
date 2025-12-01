import { API_URL } from '@env'
import axios from 'axios'

export const noInterceptorApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})
