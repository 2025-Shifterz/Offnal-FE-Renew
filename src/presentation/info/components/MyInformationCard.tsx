import { Image, TouchableOpacity, View } from 'react-native'
import ChevronRightIcon from '../../../assets/icons/ic_chervon_right.svg'
import GlobalText from '../../../shared/components/text/GlobalText'

type MyInformationCardProps = {
  profileImgUrl?: string
  profileName: string
  onPressEditProfile: () => void
}

const MyInformationCard = ({
  profileImgUrl,
  profileName,
  onPressEditProfile,
}: MyInformationCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPressEditProfile}
      activeOpacity={0.8}
      className="w-full flex-row items-center py-[10px]"
    >
      <MyInformationImage profileImgUrl={profileImgUrl} />

      <View className="flex-1">
        <GlobalText className="font-pretMedium text-body-s text-text-basic">
          {profileName}
        </GlobalText>
        <GlobalText className="mt-[2px] font-pretRegular text-label-xxs text-text-disabled">
          프로필 수정
        </GlobalText>
      </View>

      <ChevronRightIcon width={20} height={20} />
    </TouchableOpacity>
  )
}

type MyInformationImageProps = {
  profileImgUrl?: string
}

const MyInformationImage = ({ profileImgUrl }: MyInformationImageProps) => {
  return (
    <View className="mr-[12px] h-number-12 w-number-12 items-center justify-center rounded-full bg-surface-gray-subtle2">
      <Image
        source={
          profileImgUrl
            ? { uri: profileImgUrl }
            : require('../../../assets/images/default_profile.png')
        }
        className="h-full w-full rounded-full"
        resizeMode="cover"
      />
    </View>
  )
}

export default MyInformationCard
