import { NavigatorScreenParams } from '@react-navigation/native'
import dayjs from 'dayjs'
import { Memo } from '../../domain/models/Memo'
import type { RoutineDay } from '../../shared/components/routine/routineContent'
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
  DailyRoutine: { day?: RoutineDay } | undefined
  RecommendHealthContentDetail:
    | {
        title: string
        author: string
        body?: string | null
        imageUrl?: string | null
        authorProfileImageUrl?: string | null
      }
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
