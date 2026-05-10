import { NavigatorScreenParams } from '@react-navigation/native'
import dayjs from 'dayjs'
import { Memo } from '../../domain/models/Memo'
import { LoginStackParamList } from './LoginStackParamList'
import { OnboardingStackParamList } from './OnboardingStackParamList'
import { TabParamList } from './TabParamList'

type WorkTimesParam = {
  D: { startTime: string; endTime: string }
  E: { startTime: string; endTime: string }
  N: { startTime: string; endTime: string }
}

export type RootStackParamList = {
  SplashScreen: undefined
  Tabs: NavigatorScreenParams<TabParamList> | undefined
  LoginScreens: NavigatorScreenParams<LoginStackParamList> | undefined
  OnboardingMethodScreen: {
    createScheduleButtonClick: boolean
  }
  OnboardingSchedules:
    | NavigatorScreenParams<OnboardingStackParamList>
    | undefined
  AutoAlarm: undefined
  Todo: { selectedDate: dayjs.Dayjs | null }
  Memo: { selectedDate: dayjs.Dayjs | null }
  AddMemo: { memo?: Memo; date?: string } | undefined
  TeamEditCalendar: {
    workTimes: WorkTimesParam
    selectedDate?: string
  }
  EditCalendar: {
    workTimes: WorkTimesParam
    selectedDate?: string
  }
  CalendarInfoEdit: undefined
  EditProfileScreen: undefined
  FeedbackScreen: undefined
  TermsWebViewScreen: { title: string; url: string }
  WithdrawBeforeScreen: undefined
  WithdrawScreen: undefined
  CreateAlarm: undefined
  EditAutoAlarm: { alarmId: string }
}
