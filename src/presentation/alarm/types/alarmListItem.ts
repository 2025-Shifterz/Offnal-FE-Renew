export type AlarmListShiftType = '주간' | '오후' | '야간' | '휴일'
export type AlarmListMeridiem = '오전' | '오후'

export interface AlarmListItem {
  id: string
  shiftType: AlarmListShiftType
  etaText: string
  meridiem: AlarmListMeridiem
  time: string
  enabled: boolean
}
