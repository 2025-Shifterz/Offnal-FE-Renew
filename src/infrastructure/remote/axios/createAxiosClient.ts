import axios from 'axios'
import { API_URL, OPEN_API_URL } from '@env'

export const baseAxiosClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

export const apiAxiosClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

export const openApiAxiosClient = axios.create({
  baseURL: OPEN_API_URL,
  timeout: 10000,
})
