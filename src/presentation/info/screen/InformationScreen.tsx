import TopAppBar from '../../../shared/components/TopAppBar'
import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MyInformationCard from '../component/MyInformationCard'
import InformationMenuContainer, {
  MenuItemProps,
} from '../component/InformationMenuContainer'

const informationMenus: MenuItemProps[] = [
  {
    id: 'notice',
    title: '공지사항',
    onPress: id => {
      /* TODO("Not yet Implemeted") */
    },
  },
  {
    id: 'version',
    title: '현재 버전',
    caption: '0.0.1',
    onPress: id => {
      /* TODO("Not yet Implemeted") */
    },
  },
  {
    id: 'feedback',
    title: '평가 및 피드백',
    onPress: id => {
      /* TODO("Not yet Implemeted") */
    },
  },
]
const termsOfUseMenus: MenuItemProps[] = [
  {
    id: 'termsOfUse',
    title: '이용 약관',
    onPress: id => {
      /* TODO("Not yet Implemeted") */
    },
  },
  {
    id: 'privacyPolicy',
    title: '개인정보 처리방침',
    onPress: id => {
      /* TODO("Not yet Implemeted") */
    },
  },
]
const otherMenus: MenuItemProps[] = [
  {
    id: 'withdraw',
    title: '회원 탈퇴',
    onPress: id => {
      /* TODO("Not yet Implemeted") */
    },
  },
  {
    id: 'logout',
    title: '로그아웃',
    onPress: id => {
      /* TODO("Not yet Implemeted") */
    },
  },
]

const InformationScreen = () => {
  return (
    <View className="flex-1 bg-surface-gray-subtle1">
      <SafeAreaView className="flex-1">
        <TopAppBar title="내 정보" showBackButton={true} />
        <ScrollView className="flex-1 px-number-8">
          <View className="flex-col gap-g-2">
            <MyInformationCard
              profileName="김건우"
              onPressEditProfile={() => {}}
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
