// import React, { useEffect, useRef } from 'react'
// import { ScrollView, View } from 'react-native'
// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
// import {
//   onboardingNavigation,
//   OnboardingStackParamList,
// } from '../../../navigation/types'
// import CalendarEditor, {
//   CalendarEditorRef,
// } from '../components/calendar/personal/CalendarEditor'
// import TCalendarEditor from '../components/calendar/team/TCalendarEditor'
// import { useWorkTime } from '../../../shared/context/WorkTimeContext'
// import TitleMessage from '../../../shared/components/TitleMessage'
// import BottomButton from '../../../shared/components/BottomButton'
// import { SafeAreaView } from 'react-native-safe-area-context'

// type ScheduleTypeRouteProp = RouteProp<OnboardingStackParamList, 'CalendarType'>

// const InputCalendarType = () => {
//   const route = useRoute<ScheduleTypeRouteProp>()
//   const { selectedScheduleScopeType, calendarName, workGroup, workTimes } =
//     route.params
//   console.log(selectedScheduleScopeType)
//   console.log(calendarName)
//   console.log(workGroup)
//   console.log(workTimes)

//   const { setWorkTimes } = useWorkTime()

//   useEffect(() => {
//     if (workTimes) {
//       setWorkTimes(workTimes)
//     }
//   }, [workTimes, setWorkTimes])

//   const navigation = useNavigation<onboardingNavigation>()

//   // 자식의 postData 호출
//   const calendarEditorRef = useRef<CalendarEditorRef>(null)
//   const handleNext = () => {
//     if (calendarEditorRef.current) {
//       calendarEditorRef.current.postData() // 근무표 저장 요청
//     }
//     navigation.navigate('CompleteSchedule', { selectedScheduleScopeType })
//   }

//   return (
//     <SafeAreaView
//       edges={['left', 'right', 'bottom']}
//       className="flex-1 bg-background-gray-subtle1 px-[16px]"
//     >
//       <ScrollView className="mb-[100px] w-full flex-1">
//         <TitleMessage
//           title="달력에 근무 형태를 입력해주세요."
//           subTitle="각 날짜에 해당하는 근무 유형을 선택해주세요."
//         />
//         <View className="mt-[20px]">
//           {selectedScheduleScopeType === 'ALL' ? (
//             <TCalendarEditor
//               calendarName={calendarName}
//               workGroup={workGroup}
//               workTimes={workTimes}
//             />
//           ) : (
//             <CalendarEditor
//               ref={calendarEditorRef}
//               calendarName={calendarName}
//               workGroup={workGroup}
//               workTimes={workTimes}
//             />
//           )}
//         </View>
//       </ScrollView>
//       <View>
//         <BottomButton text="다음" onPress={handleNext} />
//       </View>
//     </SafeAreaView>
//   )
// }

// export default InputCalendarType
