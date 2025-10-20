import TopAppBar from '../../../shared/components/TopAppBar'
import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MyInformationCard from '../component/MyInformationCard'
import InformationMenuContainer, {
  MenuItemProps,
} from '../component/InformationMenuContainer'
import { useEffect, useMemo, useCallback } from 'react'
import {
  CommonActions,
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { TERMS_OF_USE_URL, PRIVACY_POLICY_URL } from '@env'
import {
  InfoStackParamList,
  RootStackParamList,
  TabParamList,
} from '../../../navigation/types'
import ShowLogOutAlert from '../component/InformationAlertDialogs'
import { useUserStore } from '../../../store/useUserStore'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { useAuthStore } from '../../../store/useAuthStore'

type InformationScreenComposedNavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<InfoStackParamList>,
  CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >
>

const informationMenus: MenuItemProps[] = [
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
    caption: '0.0.1',
    onPress: () => {
      /* TODO("Not yet Implemeted") */
    },
  },
  {
    id: 'feedback',
    title: '평가 및 피드백',
    onPress: () => {
      /* TODO("Not yet Implemeted") */
    },
  },
]

const InformationScreen = () => {
  const navigation = useNavigation<InformationScreenComposedNavigationProps>()

  const { user, fetchProfile } = useUserStore()
  const logout = useAuthStore(state => state.logout)

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleLogout = useCallback(() => {
    ShowLogOutAlert(() => {
      logout()
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'LoginScreens' }],
        })
      )
    })
  }, [logout, navigation])

  const otherMenus: MenuItemProps[] = useMemo(
    () => [
      {
        id: 'withdraw',
        title: '회원 탈퇴',
        onPress: () => {
          /* TODO("Not yet Implemeted") */
        },
      },
      {
        id: 'logout',
        title: '로그아웃',
        onPress: handleLogout,
      },
    ],
    [handleLogout]
  )

  const termsOfUseMenus: MenuItemProps[] = useMemo(
    () => [
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
    ],
    [navigation]
  )

  return (
    <View className="flex-1 bg-surface-gray-subtle1">
      <SafeAreaView className="flex-1">
        <TopAppBar title="내 정보" />
        <ScrollView className="flex-1 px-number-8">
          <View className="flex-col gap-g-2">
            <MyInformationCard
              profileImgUrl={user?.profileImageUrl}
              profileName={user?.memberName ?? '(알 수 없음)'}
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
