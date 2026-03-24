export interface GetRestDeInfoResponse {
  response: GetRestDeInfoResponseData
}

export interface GetRestDeInfoResponseData {
  header: GetRestDeInfoHeader
  body: GetRestDeInfoBody
}

export interface GetRestDeInfoHeader {
  resultCode: string
  resultMsg: string
}

export interface GetRestDeInfoBody {
  items: GetRestDeInfoItems
  numOfRows: number
  pageNo: number
  totalCount: number
}

export interface GetRestDeInfoItems {
  item: GetRestDeInfoItem[]
}

export interface GetRestDeInfoItem {
  dateKind: string
  dateName: string
  isHoliday: 'Y' | 'N' | string
  locdate: number
  seq: number
}

export type SerializedGetRestDeInfoResponse = GetRestDeInfoResponseData
