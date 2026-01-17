// import {
//   createNativeStackNavigator,
//   NativeStackNavigationProp,
// } from '@react-navigation/native-stack'
// import { ParamListBase } from '@react-navigation/native'
// import SelectMonthOCRScreen from '../presentation/schedule/screens/ocr/SelectMonthOCRScreen'
// import EditScheduleOCRScreen from '../presentation/schedule/screens/ocr/EditScheduleOCRScreen'
// import { OnboardingOCRStackParamList } from './types'
// import SelectScheduleScopeOCR from '../presentation/schedule/screens/ocr/SelectScheduleScopeOCRScreen'
// import InputScheduleOCR from '../presentation/schedule/screens/ocr/InputScheduleOCRScreen'
// import StepBar from '../shared/components/StepBar'
// import CompleteScheduleOCRScreen from '../presentation/schedule/screens/ocr/CompleteScheduleOCRScreen'
// import SelectPhotoOCRScreen from '../presentation/schedule/screens/ocr/SelectPhotoOCRScreen'
// import SelectScheduleRegScreen from '../presentation/schedule/screens/SelectScheduleRegScreen'
// import CenterAlignedTopAppBar from '../shared/components/appbar/CenterAlignedTopAppBar'
// import TopAppBarBackButton from '../shared/components/button/TopAppBarBackButton'

// const Stack = createNativeStackNavigator<OnboardingOCRStackParamList>()

// const OnBoardingScheduleOCRHeader = ({
//   navigation,
//   currentStep,
// }: {
//   navigation: NativeStackNavigationProp<ParamListBase>
//   currentStep: number
// }) => {
//   return (
//     <CenterAlignedTopAppBar
//       navigationIcon={
//         <TopAppBarBackButton onPress={() => navigation.goBack()} />
//       }
//       title={<StepBar currentStep={currentStep} totalSteps={6} />}
//       applySafeArea={true}
//     />
//   )
// }

// // + 온보딩 화면들
// const OnBoardingScheduleWithOCRNavigator = () => {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShadowVisible: false,
//         headerStyle: { backgroundColor: '#F4F5F6' },
//       }}
//     >
//       <Stack.Screen
//         name="SelectScheduleReg"
//         component={SelectScheduleRegScreen}
//       />
//       <Stack.Screen
//         // 근무표 범위 선택 - 전체 / 개인
//         name="SelectScheduleScopeOCR"
//         component={SelectScheduleScopeOCR}
//         options={{
//           header: ({ navigation }) => (
//             <OnBoardingScheduleOCRHeader
//               navigation={navigation}
//               currentStep={0}
//             />
//           ),
//         }}
//       />
//       <Stack.Screen
//         name="InputScheduleOCR"
//         component={InputScheduleOCR}
//         options={{
//           header: ({ navigation }) => (
//             <OnBoardingScheduleOCRHeader
//               navigation={navigation}
//               currentStep={1}
//             />
//           ),
//         }}
//       />
//       {/* <Stack.Screen
//         name="SelectMonthOCR"
//         component={SelectMonthOCRScreen}
//         options={{
//           header: ({ navigation }) => (
//             <OnBoardingScheduleOCRHeader
//               navigation={navigation}
//               currentStep={2}
//             />
//           ),
//         }}
//       /> */}

//       {/* <Stack.Screen
//         name="SelectPhotoOCR"
//         component={SelectPhotoOCRScreen}
//         options={{
//           header: ({ navigation }) => (
//             <OnBoardingScheduleOCRHeader
//               navigation={navigation}
//               currentStep={3}
//             />
//           ),
//         }}
//       /> */}

//       {/* <Stack.Screen
//         name="EditScheduleOCR"
//         component={EditScheduleOCRScreen}
//         options={{
//           header: ({ navigation }) => (
//             <OnBoardingScheduleOCRHeader
//               navigation={navigation}
//               currentStep={4}
//             />
//           ),
//         }}
//       /> */}

//       <Stack.Screen
//         name="CompleteScheduleOCR"
//         component={CompleteScheduleOCRScreen}
//         options={{
//           header: ({ navigation }) => (
//             <OnBoardingScheduleOCRHeader
//               navigation={navigation}
//               currentStep={5}
//             />
//           ),
//         }}
//       />
//     </Stack.Navigator>
//   )
// }

// export default OnBoardingScheduleWithOCRNavigator
