import axios from 'axios'
import { API_URL } from '@env'

const baseApi = axios.create({
  baseURL: API_URL,
  timeout: 5000,
})

export default baseApi
