import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, ActivityIndicator, Alert } from 'react-native'
import { WebView } from 'react-native-webview'
import { API_URL } from '@env'
import { useNavigation } from '@react-navigation/native'
import { loginNavigation } from '../../../navigation/types'
import { authService } from '../../../infrastructure/di/Dependencies'
import { useAuthStore } from '../../../store/useAuthStore'
import { useUserStore } from '../../../store/useUserStore'

const REDIRECT_URI = `${API_URL}/callback`

const KakaoLoginWebView = () => {
  const [loginUrl, setLoginUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const webviewRef = useRef(null)
  const navigation = useNavigation<loginNavigation>()
  const [shouldHideWebView, setShouldHideWebView] = useState(false)

  useEffect(() => {
    const fetchLoginUrl = async () => {
      try {
        const data = await authService.getLoginUrl()
        setLoginUrl(data)
      } catch (err) {
        Alert.alert('에러', '카카오 로그인 페이지를 가져오지 못했습니다.')
        console.error('Failed to fetch login URL:', err)
        navigation.goBack()
      }
    }

    fetchLoginUrl()
  }, [navigation])

  // WebView 내에서 JS로 document.body.innerText → RN으로 전달
  const injectedJS = `
    if (window.location.href.startsWith('${REDIRECT_URI}')) {
      window.ReactNativeWebView.postMessage(document.body.innerText);
    }
    true;
  `

  const handleMessage = async (event: any) => {
    try {
      setShouldHideWebView(true)

      const data = JSON.parse(event.nativeEvent.data)
      console.log('KakaoLoginWebView - handleMessage data:', data)

      const accessToken = data.data?.accessToken
      const refreshToken = data.data?.refreshToken
      const memberName = data.data?.memberName
      const newMember = data.data?.newMember
      const email = data.data?.email
      const profileImageUrl = data.data?.profileImageUrl

      if (!accessToken || !refreshToken) {
        Alert.alert('토큰 없음', '다시 로그인해주세요.')
        return
      }

      // Zustand 상태에 로그인 정보 저장
      const { login } = useAuthStore.getState()
      login(
        {
          memberName: memberName,
          email: email,
          phoneNumber: '',
          profileImageUrl: profileImageUrl,
        },
        accessToken,
        refreshToken
      )

      // store에 저장되는지 확인
      const { user } = useUserStore.getState()
      console.log('Stored user in Zustand:', user)
      const {
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
      } = useAuthStore.getState()
      console.log('Stored auth in Zustand:', {
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
      })

      // TODO: 처음 로그인 아닐 때 홈 화면으로 이동한느거 필요함
      if (!newMember) {
        Alert.alert('로그인 성공', `${memberName}님 환영합니다!`)
        console.log('accessToken:', accessToken)
        console.log('refreshToken:', refreshToken)
        console.log('memberName:', memberName)
        navigation.replace('Tabs')
      }

      navigation.replace('SelectRegMethod')
    } catch (err) {
      Alert.alert('에러', '로그인 응답 처리 중 오류 발생')
      console.error('postMessage parse error:', err)
    }
  }

  if (!loginUrl || isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1">
      {!shouldHideWebView ? (
        <WebView
          ref={webviewRef}
          source={{ uri: loginUrl }}
          onMessage={handleMessage}
          injectedJavaScript={injectedJS}
          javaScriptEnabled
          startInLoadingState
          className="flex-1"
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      )}
    </SafeAreaView>
  )
}

export default KakaoLoginWebView
