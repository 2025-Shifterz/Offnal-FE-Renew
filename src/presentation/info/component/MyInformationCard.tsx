import { Image, TouchableOpacity, View } from 'react-native'
import GlobalText from '../../../shared/components/GlobalText'

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
    <View className="flex-row items-center justify-between rounded-3xl bg-white px-number-6 py-number-4">
      <MyInformationImage profileImgUrl={profileImgUrl} />
      <GlobalText className="flex-1 font-pretMedium text-body-s">
        {profileName}
      </GlobalText>

      <TouchableOpacity onPress={onPressEditProfile}>
        <GlobalText className="font-pretMedium text-body-xxs text-text-disabled">
          프로필 수정
        </GlobalText>
      </TouchableOpacity>
    </View>
  )
}

type MyInformationImageProps = {
  profileImgUrl?: string
}

const MyInformationImage = ({ profileImgUrl }: MyInformationImageProps) => {
  return (
    <View className="mr-3 h-number-12 w-number-12 items-center justify-center rounded-full bg-surface-gray-subtle2">
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
