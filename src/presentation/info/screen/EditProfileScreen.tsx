import { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native'
import GalleryIcon from '../../../assets/icons/ic_gallery_16_white.svg'
import { useUserStore } from '../../../store/useUserStore'
import { useNavigation } from '@react-navigation/native'
import { rootNavigation } from '../../../navigation/types/StackTypes'
import { Asset, launchImageLibrary } from 'react-native-image-picker'
import CenterAlignedTopAppBar from '../../../shared/components/appbar/CenterAlignedTopAppBar'
import TopAppBarBackButton from '../../../shared/components/button/TopAppBarBackButton'
import GlobalText from '../../../shared/components/text/GlobalText'

const MAX_NAME_LENGTH = 10

const EditProfileScreen = () => {
  const navigation = useNavigation<rootNavigation>()
  const { user, updateProfile } = useUserStore()
  const [name, setName] = useState(user?.memberName ?? '')

  const [newImage, setNewImage] = useState<Asset | null>(null)
  const [displayImgUrl, setDisplayImgUrl] = useState<string | null>(
    user?.profileImageUrl ?? null
  )

  const handleChoosePhoto = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode)
        Alert.alert('오류', '이미지를 가져오는 데 실패했습니다.')
      } else if (response.assets && response.assets.length > 0) {
        const imageAsset = response.assets[0]
        setNewImage(imageAsset)
        setDisplayImgUrl(imageAsset.uri ?? null)
      }
    })
  }
  useEffect(() => {
    if (user) {
      setName(user?.memberName ?? '')
      setDisplayImgUrl(user?.profileImageUrl ?? null)
      setNewImage(null)
    }
  }, [user])

  const handleUpdateProfile = async () => {
    if (!user) {
      Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.')
      return
    }

    if (name.trim().length === 0) {
      Alert.alert('오류', '이름을 입력해주세요.')
      return
    }

    try {
      await updateProfile(
        name,
        newImage && newImage.uri && newImage.type && newImage.fileName
          ? {
              uri: newImage.uri,
              type: newImage.type,
              fileName: newImage.fileName,
            }
          : null
      )

      Alert.alert('성공', '프로필이 수정되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            navigation.goBack()
          },
        },
      ])
    } catch (error) {
      console.error(error)
      Alert.alert('오류', '프로필 수정에 실패했습니다.')
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CenterAlignedTopAppBar
          navigationIcon={<TopAppBarBackButton onPress={navigation.goBack} />}
          title={
            <GlobalText className="font-pretSemiBold text-heading-xs">
              프로필 수정
            </GlobalText>
          }
          rightActions={
            <TouchableOpacity onPress={handleUpdateProfile}>
              <Text>저장하기</Text>
            </TouchableOpacity>
          }
          applySafeArea={true}
        />
      ),
      headerShown: true,
      headerShadowVisible: false,
    })
  }, [navigation, handleUpdateProfile])

  return (
    <View className="flex-1 bg-background-gray-subtle1">
      <SafeAreaView className="flex-1" edges={['bottom']}>
        <View className="mb-number-8 mt-number-8 items-center">
          <View className="relative h-32 w-32 items-center justify-center">
            <View className="relative h-32 w-32 items-center justify-center rounded-full bg-surface-gray-subtle2">
              <Image
                source={
                  displayImgUrl
                    ? { uri: displayImgUrl }
                    : require('../../../assets/images/default_profile.png')
                }
                className="h-full w-full rounded-full"
                resizeMode="cover"
              />
            </View>

            <TouchableOpacity
              onPress={handleChoosePhoto}
              className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-surface-disabled"
            >
              <GalleryIcon width={18} height={18} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-p-7">
          <Text className="mb-number-3 text-text-subtle body-xxs">이름</Text>
          <View className="flex-row items-center justify-between rounded-lg border-alpha-inverse10 bg-white px-4">
            <TextInput
              className="flex-1 py-3 text-text-basic label-xs"
              placeholder="이름을 입력해주세요."
              placeholderTextColor="#A0A0A0"
              value={name}
              onChangeText={text => setName(text.slice(0, MAX_NAME_LENGTH))}
              maxLength={MAX_NAME_LENGTH}
            />
            <Text className="text-text-disabled label-xs">
              {name.length}/{MAX_NAME_LENGTH}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default EditProfileScreen
