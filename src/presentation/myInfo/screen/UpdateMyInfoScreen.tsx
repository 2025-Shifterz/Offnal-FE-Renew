import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopAppBar from '../components/TopAppBar'

import GalleryIcon from '../../../assets/icons/ic_gallery_16_white.svg'

const UpdateMyInfoScreen = () => {
  const [userName, setUserName] = useState('')
  const MAX_NAME_LENGTH = 10

  return (
    <View className="flex-1 bg-background-gray-subtle1">
      <SafeAreaView className="flex-1">
        <TopAppBar title="프로필 수정" enableNavigationBtn={true} />

        <View className="mb-number-8 mt-number-8 items-center">
          <View className="relative h-32 w-32 items-center justify-center">
            <View className="relative h-32 w-32 items-center justify-center rounded-full bg-surface-gray-subtle2">
              <Image
                source={require('../../../assets/images/default_profile.png')}
                className="h-full w-full rounded-full"
                resizeMode="cover"
              />
            </View>

            <TouchableOpacity className="absolute bottom-0 right-0 h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-surface-disabled">
              <GalleryIcon width={18} height={18} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-number-8">
          <Text className="mb-number-3 text-text-subtle body-xxs">이름</Text>
          <View className="flex-row items-center justify-between rounded-lg border-alpha-inverse10 bg-white px-4">
            <TextInput
              className="flex-1 py-3 text-text-basic label-xs"
              placeholder="이름을 입력해주세요."
              placeholderTextColor="#A0A0A0"
              value={userName}
              onChangeText={text => setUserName(text.slice(0, MAX_NAME_LENGTH))}
              maxLength={MAX_NAME_LENGTH}
            />
            <Text className="text-text-disabled label-xs">
              {userName.length}/{MAX_NAME_LENGTH}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default UpdateMyInfoScreen
