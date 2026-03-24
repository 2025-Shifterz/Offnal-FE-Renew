import axios from 'axios'
import { OPEN_API_URL } from '@env'

export const openApiAxiosClient = axios.create({
  baseURL: OPEN_API_URL,
  timeout: 10000,
})
