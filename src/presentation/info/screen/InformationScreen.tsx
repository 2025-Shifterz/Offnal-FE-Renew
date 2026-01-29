import TopAppBar from '../../../shared/components/appbar/TopAppBar'
import { Alert, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MyInformationCard from '../component/MyInformationCard'
import InformationMenuContainer, {
  MenuItemProps,
} from '../component/InformationMenuContainer'
import { useCallback, useMemo } from 'react'
import { rootNavigation } from '../../../navigation/types/StackTypes'
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native'
import { useAuthStore } from '../../../store/useAuthStore'
import { TERMS_OF_USE_URL, PRIVACY_POLICY_URL } from '@env'
import { useUserStore } from '../../../store/useUserStore'

const InformationScreen = () => {
  const navigation = useNavigation<rootNavigation>()

  const user = useUserStore(state => state.user)
  const fetchProfile = useUserStore(state => state.fetchProfile)
  const logout = useAuthStore(state => state.logout)

  useFocusEffect(
    useCallback(() => {
      fetchProfile()
    }, [fetchProfile])
  )

  const handleLogOut = useCallback(() => {
    Alert.alert('로그아웃', '정말로 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        onPress: () => {
          logout()

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'LoginScreens' }],
            })
          )
        },
        style: 'destructive',
      },
    ])
  }, [logout, navigation])

  const informationMenus: MenuItemProps[] = useMemo(() => {
    return [
      {
        id: 'notice',
        title: '공지사항',
        onPress: () => {
          /* TODO("Not yet Implemeted") */
        },
      },
      {
        id: 'version',
        title: '현재 버전',
        caption: '1.0.0',
        onPress: () => {
          /* TODO("Not yet Implemeted") */
        },
      },
      {
        id: 'feedback',
        title: '평가 및 피드백',
        onPress: () => {
          navigation.navigate('FeedbackScreen')
        },
      },
    ]
  }, [navigation])

  const termsOfUseMenus: MenuItemProps[] = useMemo(() => {
    return [
      {
        id: 'termsOfUse',
        title: '이용 약관',
        onPress: () => {
          navigation.navigate('TermsWebViewScreen', {
            url: TERMS_OF_USE_URL,
            title: '이용 약관',
          })
        },
      },
      {
        id: 'privacyPolicy',
        title: '개인정보 처리방침',
        onPress: () => {
          navigation.navigate('TermsWebViewScreen', {
            url: PRIVACY_POLICY_URL,
            title: '개인정보 처리방침',
          })
        },
      },
    ]
  }, [navigation])

  const otherMenus: MenuItemProps[] = useMemo(() => {
    return [
      {
        id: 'withdraw',
        title: '회원 탈퇴',
        onPress: () => {
          navigation.navigate('WithdrawBeforeScreen')
        },
      },
      {
        id: 'logout',
        title: '로그아웃',
        onPress: () => handleLogOut(),
      },
    ]
  }, [navigation, handleLogOut])

  return (
    <View className="flex-1 bg-surface-gray-subtle1">
      <SafeAreaView className="flex-1">
        <TopAppBar title="내 정보" />
        <ScrollView className="flex-1 px-number-8">
          <View className="flex-col gap-g-2">
            <MyInformationCard
              profileName={user?.memberName ?? ''}
              profileImgUrl={user?.profileImageUrl ?? ''}
              onPressEditProfile={() => {
                navigation.navigate('EditProfileScreen')
              }}
            />
            <InformationMenuContainer
              menuTitle="이용 안내"
              menuItems={informationMenus}
            />
            <InformationMenuContainer
              menuTitle="운영 방침"
              menuItems={termsOfUseMenus}
            />
            <InformationMenuContainer menuTitle="기타" menuItems={otherMenus} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default InformationScreen
