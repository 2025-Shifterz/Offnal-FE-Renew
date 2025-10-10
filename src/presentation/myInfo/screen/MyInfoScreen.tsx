import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopAppBar from '../components/TopAppBar'
import ProfileCard from '../components/ProfileCard'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'

const MyInfoScreen = () => {
  const navigation = useNavigation()

  // <----- persist로 AsyncStorage에 저장되었는지 확인
  // webView에서는 AsyncStorage 접근 불가
  // (디버깅용, 나중에 지울 것)
  useEffect(() => {
    const checkStoredData = async () => {
      const storedAuth = await AsyncStorage.getItem('auth-storage')
      const storedUser = await AsyncStorage.getItem('user-storage')

      if (storedAuth) {
        console.log('Stored Zustand data after login:', JSON.parse(storedAuth))
      } else {
        console.log('No auth data found.')
      }

      if (storedUser) {
        console.log('Stored User data after login:', JSON.parse(storedUser))
      } else {
        console.log('No user data found.')
      }
    }

    checkStoredData()
  }, [])
  // -------->

  return (
    <View className="flex-1 bg-background-gray-subtle1">
      <SafeAreaView className="flex-1">
        <TopAppBar title="내 정보" enableNavigationBtn={false} />
        <ScrollView className="flex-1 px-number-8">
          <ProfileCard
            name="김건우"
            onPressEditProfile={() => {
              navigation.navigate('UpdateMyInfoScreen')
            }}
          />

          <View className="mb-4 rounded-xl bg-white px-number-8 py-number-3 shadow-sm">
            <TouchableOpacity className="flex-row items-center justify-between py-number-6">
              <Text className="text-text-subtle body-xxs">이용 안내</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between py-number-6">
              <Text className="text-text-basic body-xs">공지사항</Text>
            </TouchableOpacity>
            <View className="flex-row items-center justify-between py-number-6">
              <Text className="text-text-basic body-xs">현재 버전</Text>
              <Text className="text-text-disabled body-xxs">1.0.0</Text>
            </View>
            <TouchableOpacity className="flex-row items-center justify-between py-number-6">
              <Text className="text-text-basic body-xs">평가 및 피드백</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4 rounded-xl bg-white px-number-8 py-number-3 shadow-sm">
            <TouchableOpacity className="flex-row items-center justify-between py-number-6">
              <Text className="text-text-subtle body-xxs">운영 방침</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-between py-number-6"
              onPress={() => {}}
            >
              <Text className="text-text-basic body-xs">이용약관</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-between py-number-6"
              onPress={() => {}}
            >
              <Text className="text-text-basic body-xs">
                개인정보 처리 방침
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4 rounded-xl bg-white px-number-8 py-number-3 shadow-sm">
            <TouchableOpacity className="flex-row items-center justify-between py-number-6">
              <Text className="text-text-subtle body-xxs">기타</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between py-number-6">
              <Text className="text-text-basic body-xs">회원 탈퇴</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between py-number-6">
              <Text className="text-text-basic body-xs">로그아웃</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default MyInfoScreen
