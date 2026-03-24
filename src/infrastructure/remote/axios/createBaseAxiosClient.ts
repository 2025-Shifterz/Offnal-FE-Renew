import axios from 'axios'
import { API_URL } from '@env'

export const baseAxiosClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})
