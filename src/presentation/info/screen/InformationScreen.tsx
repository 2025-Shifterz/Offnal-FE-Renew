import TopAppBar from '../../../shared/components/TopAppBar'
import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MyInformationCard from '../component/MyInformationCard'
import InformationMenuContainer, {
  MenuItemProps,
} from '../component/InformationMenuContainer'
import { useEffect, useMemo } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { TERMS_OF_USE_URL, PRIVACY_POLICY_URL } from '@env'
import { InfoStackParamList } from '../../../navigation/types'
import ShowLogOutAlert from '../component/InformationAlertDialogs'

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

const otherMenus: MenuItemProps[] = [
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
    onPress: () => {
      ShowLogOutAlert(() => {
        /* TODO("Not yet Implemeted") */
      })
    },
  },
]

const InformationScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<InfoStackParamList>>()

  useEffect(() => {
    const checkStoredData = async () => {
      const storedAuth = await EncryptedStorage.getItem('auth-storage')
      const storedUser = await EncryptedStorage.getItem('user-storage')

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
  })

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
              profileName="김건우"
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
