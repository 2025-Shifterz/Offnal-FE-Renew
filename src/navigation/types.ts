import { NavigatorScreenParams } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ScheduleScopeType } from '../shared/types/ScheduleScopeType'
import { Memo } from '../domain/models/Memo'

// 네비게이션
export type onboardingNavigation =
  NativeStackNavigationProp<OnboardingStackParamList>
// export type onboardingOCRNavigation =
//   NativeStackNavigationProp<OnboardingOCRStackParamList>
export type loginNavigation = NativeStackNavigationProp<LoginStackParamList>
export type tabNavigation = NativeStackNavigationProp<TabParamList>
export type rootNavigation = NativeStackNavigationProp<RootStackParamList>
export type autoAlarmNavigation =
  NativeStackNavigationProp<AutoAlarmScreenStackParamList>

// 루트 네비게이터
export type RootStackParamList = {
  SplashScreen: undefined
  Tabs: NavigatorScreenParams<TabParamList> | undefined
  LoginScreens: NavigatorScreenParams<LoginStackParamList> | undefined
  OnboardingMethodScreen: undefined
  OnboardingSchedules:
    | NavigatorScreenParams<OnboardingStackParamList>
    | undefined
  // OnboardingSchedulesOCR:
  //   | NavigatorScreenParams<OnboardingOCRStackParamList>
  //   | undefined

  // Migrate from MainNavigator.tsx
  AutoAlarm: undefined
  Todo: undefined
  Memo: undefined
  AddMemo: { memo?: Memo; date?: string } | undefined

  //Migrate from CalendarNavigator.tsx
  TeamEditCalendar: {
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
  }
  EditCalendar: {
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
  }
  CalendarInfoEdit: undefined

  // Migrate from MyInforNavigator.tsx
  EditProfileScreen: undefined
  FeedbackScreen: undefined
  TermsWebViewScreen: { title: string; url: string }
  WithdrawBeforeScreen: undefined
  WithdrawScreen: undefined
}

// 탭 네비게이터
export type TabParamList = {
  Home: undefined
  Calendar: undefined
  MyInformation: undefined
}

// 로그인
export type LoginStackParamList = {
  Login: undefined
  KakaoWebView: undefined
  TermsWebViewScreen: { title: string; url: string }
}

// 온보딩 캘린더
export type OnboardingStackParamList = {
  SelectScheduleScope: undefined
  InputSchedule: { selectedScheduleScopeType: ScheduleScopeType }

  // OCR 관련 화면들 --
  SelectMonthOCR: {
    selectedScheduleScopeType: ScheduleScopeType
    organizationName: string
    workGroup: string
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
  }
  SelectPhotoOCR: {
    selectedScheduleScopeType: ScheduleScopeType
    organizationName: string
    workGroup: string
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
    year: number
    month: number
    ocrResult?: unknown
  }
  EditScheduleOCR: {
    selectedScheduleScopeType: ScheduleScopeType
    organizationName: string
    workGroup: string
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
    year: number
    month: number
    ocrResult?: unknown
  }
  // --

  InputCalendarType: {
    selectedScheduleScopeType: ScheduleScopeType
    organizationName: string
    workGroup: string
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
  }
  CompleteSchedule: { selectedScheduleScopeType: ScheduleScopeType }
}

// // 온보딩 OCR 캘린더
// export type OnboardingOCRStackParamList = {
//   SelectScheduleReg: undefined
//   SelectScheduleScopeOCR: undefined
//   InputScheduleOCR: { selectedScheduleScopeType: ScheduleScopeType }
//   InputCalendarTypeOCR: {
//     selectedScheduleScopeType: ScheduleScopeType
//     calendarName: string
//     workGroup: string
//     workTimes: {
//       D: { startTime: string; endTime: string }
//       E: { startTime: string; endTime: string }
//       N: { startTime: string; endTime: string }
//     }
//   }
//   // SelectMonthOCR: {
//   //   selectedScheduleScopeType: ScheduleScopeType
//   //   organizationName: string
//   //   workGroup: string
//   //   workTimes: {
//   //     D: { startTime: string; endTime: string }
//   //     E: { startTime: string; endTime: string }
//   //     N: { startTime: string; endTime: string }
//   //   }
//   // }
//   // SelectPhotoOCR: {
//   //   selectedScheduleScopeType: ScheduleScopeType
//   //   organizationName: string
//   //   workGroup: string
//   //   workTimes: {
//   //     D: { startTime: string; endTime: string }
//   //     E: { startTime: string; endTime: string }
//   //     N: { startTime: string; endTime: string }
//   //   }
//   //   year: number
//   //   month: number
//   //   ocrResult?: unknown
//   // }
//   // EditScheduleOCR: {
//   //   selectedScheduleScopeType: ScheduleScopeType
//   //   organizationName: string
//   //   workGroup: string
//   //   workTimes: {
//   //     D: { startTime: string; endTime: string }
//   //     E: { startTime: string; endTime: string }
//   //     N: { startTime: string; endTime: string }
//   //   }
//   //   year: number
//   //   month: number
//   //   ocrResult?: unknown
//   // }
//   CompleteScheduleOCR:
//     | { selectedScheduleScopeType: ScheduleScopeType }
//     | undefined
// }

// 오토알람 탭 네비게이터
export type AutoAlarmScreenStackParamList = {
  AutoAlarm: undefined
  CreateAlarm: undefined
  EditAutoAlarm: { alarmId: string }
}
