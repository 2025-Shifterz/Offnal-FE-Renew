import React, { useEffect, useState } from 'react'
import { Image, ImageSourcePropType, ScrollView, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/types/StackTypes'
import AppLogo from '../../../assets/icons/app_logo.svg'
import GlobalText from '../../../shared/components/text/GlobalText'

type Props = NativeStackScreenProps<
  RootStackParamList,
  'RecommendHealthContentDetail'
>

const DEFAULT_BODY =
  'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text'

const HEALTH_CONTENT_IMAGE = require('../../../assets/images/recommend_health_content_badge.jpg')

const imageLoader = (
  imageUrl: string | null | undefined,
  fallbackImage?: ImageSourcePropType
): ImageSourcePropType | undefined => {
  const trimmedImageUrl = imageUrl?.trim()

  if (trimmedImageUrl) {
    return { uri: trimmedImageUrl }
  }

  return fallbackImage
}

const RecommendHealthContentDetailScreen = ({ route }: Props) => {
  const title = route.params?.title ?? '제목 text'
  const author = route.params?.author ?? '팀 오프날'
  const body = route.params?.body ?? DEFAULT_BODY
  const imageUrl = route.params?.imageUrl
  const authorProfileImageUrl = route.params?.authorProfileImageUrl
  const [isImageLoadFailed, setIsImageLoadFailed] = useState(false)
  const [isAuthorProfileLoadFailed, setIsAuthorProfileLoadFailed] =
    useState(false)
  const contentImageSource = imageLoader(
    isImageLoadFailed ? undefined : imageUrl,
    HEALTH_CONTENT_IMAGE
  )
  const authorProfileImageSource = imageLoader(
    isAuthorProfileLoadFailed ? undefined : authorProfileImageUrl
  )

  useEffect(() => {
    setIsImageLoadFailed(false)
  }, [imageUrl])

  useEffect(() => {
    setIsAuthorProfileLoadFailed(false)
  }, [authorProfileImageUrl])

  return (
    <ScrollView
      className="flex-1 bg-background-gray-subtle1"
      bounces={false}
      contentContainerClassName="pb-[48px] pt-[4px]"
    >
      <View className="px-number-9">
        <View className="aspect-[320/179] w-full rounded-[10px] bg-surface-white shadow-sm">
          <Image
            source={contentImageSource}
            className="h-full w-full rounded-[10px]"
            onError={() => setIsImageLoadFailed(true)}
            resizeMode="cover"
          />
        </View>
      </View>

      <View className="gap-[8px] px-number-9 pt-[24px]">
        <GlobalText className="text-text-basic heading-m">{title}</GlobalText>

        <View className="flex-row items-center gap-[8px]">
          <View className="h-[24px] w-[24px] items-center justify-center overflow-hidden rounded-radius-max bg-surface-primary">
            {authorProfileImageSource ? (
              <Image
                source={authorProfileImageSource}
                className="h-full w-full"
                onError={() => setIsAuthorProfileLoadFailed(true)}
                resizeMode="cover"
              />
            ) : (
              <AppLogo width={18} height={10} />
            )}
          </View>
          <GlobalText className="text-text-subtle body-xs">{author}</GlobalText>
        </View>

        <GlobalText className="text-text-subtle body-xs">{body}</GlobalText>
      </View>
    </ScrollView>
  )
}

export default RecommendHealthContentDetailScreen
