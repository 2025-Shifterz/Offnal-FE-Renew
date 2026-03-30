import React, { useState } from 'react'
import { View, Text, Alert, Platform } from 'react-native'
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker'
import {
  openSettings,
  Permission,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions'
import RegMethod from '../../component/RegMethod'
import TakePicture from '../../../../assets/icons/ic_camera_32.svg'
import OpenGallery from '../../../../assets/icons/ic_gallery_32.svg'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { OnboardingStackParamList } from '../../../../navigation/types/StackTypes'
import { ocrService } from '../../../../infrastructure/di/Dependencies'
import ProgressModal from '../../../../shared/components/progress/ProgressModal'
import { SafeAreaView } from 'react-native-safe-area-context'
import goNextOnboadingScreen from '../../flow/goNextOnboardingScreen'
import { useOnboardingStore } from '../../../../store/useOnboardingStore'
import { OnboardingStep } from '../../types/onboardingTypes'
import { SchedulePhotoType } from '../../types/scheduleTypes'
import { OnboardingRoute } from '../../../../navigation/types/OnboardingRoute'
import EmphasizedButton from '../../../../shared/components/button/Button'
import GlobalText from '../../../../shared/components/text/GlobalText'
import { PostBedrockVisionResponse } from '../../../../infrastructure/remote/response/PostBedrockVisionResponse'

type ScheduleInfoInputRouteProp = RouteProp<
  OnboardingStackParamList,
  'SelectPhotoOCR'
>

const SelectPhotoOCRScreen = () => {
  const navigation = useNavigation<{
    navigate: (route: OnboardingRoute) => void
  }>()
  const route = useRoute<ScheduleInfoInputRouteProp>()
  const onboardingMethod = useOnboardingStore(state => state.onboardingMethod)

  const { year, month } = route.params

  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const requestPermissions = async (
    permissionType: 'camera' | 'gallery'
  ): Promise<boolean> => {
    const requiredPermissions: (Permission | undefined)[] = []

    if (permissionType === 'camera') {
      requiredPermissions.push(
        Platform.select({
          android: PERMISSIONS.ANDROID.CAMERA,
          ios: PERMISSIONS.IOS.CAMERA,
        })
      )
    } else {
      return false
    }

    let allGranted = true
    for (const perm of requiredPermissions) {
      if (!perm) continue

      const status = await request(perm as Permission)
      console.log(`Permission ${perm} status:`, status)

      if (status !== RESULTS.GRANTED) {
        allGranted = false
        if (
          status === RESULTS.BLOCKED ||
          (Platform.OS === 'ios' && status === RESULTS.DENIED)
        ) {
          Alert.alert(
            '권한 필요',
            '카메라 접근 권한이 필요합니다. 앱 설정에서 수동으로 권한을 허용해주세요.',
            [
              { text: '취소', style: 'cancel' },
              {
                text: '설정으로 이동',
                onPress: () =>
                  openSettings().catch(() =>
                    console.warn('Failed to open settings')
                  ),
              },
            ]
          )
          return false
        } else {
          Alert.alert(
            '권한 필요',
            '요청된 카메라 권한이 거부되었습니다. 해당 기능을 사용하려면 권한을 허용해야 합니다.'
          )
          return false
        }
      }
    }

    return allGranted
  }

  function normalizeTeamNumber(team: string) {
    const trimmedTeam = team.trim()

    if (trimmedTeam.endsWith('조')) {
      return trimmedTeam.slice(0, -1)
    }

    return trimmedTeam
  }

  async function handleOCRResponse(response: ImagePickerResponse) {
    if (response.didCancel) return
    if (response.errorCode) {
      Alert.alert('Camera Error', response.errorMessage)
      return
    }

    const asset = response.assets?.[0]
    if (!asset) return

    setIsAnalyzing(true)

    try {
      const visionResult: PostBedrockVisionResponse =
        await ocrService.getVisionResult(asset)

      const ocrResult: [string, Record<string, string>][] =
        visionResult.data.bedrockResponse.calendars.map(({ team, shifts }) => [
          normalizeTeamNumber(team),
          shifts,
        ])

      console.log('Serialized Vision OCR Result for Navigation:', ocrResult)
      console.log(
        'Unreadable Cells:',
        visionResult.data.bedrockResponse.unreadableCells
      )

      const nextStep = goNextOnboadingScreen(
        onboardingMethod,
        OnboardingStep.SelectPhotoOCR
      )
      navigation.navigate({
        name: nextStep,
        params: {
          year,
          month,
          ocrResult,
        },
      } as OnboardingRoute)
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e)
      Alert.alert('Analysis Error', errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const analyzeScheduleImage = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        quality: 1,
      },
      handleOCRResponse
    )
  }

  const openCameraImage = async () => {
    const hasPermission = await requestPermissions('camera')
    if (!hasPermission) return

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 1,
        saveToPhotos: true,
        includeBase64: false,
      },
      handleOCRResponse
    )
  }

  const [localSelectedPhotoBoxType, setLocalSelectedPhotoBoxType] =
    useState<SchedulePhotoType>('Gallery')

  // 이 함수는 클릭된 박스의 type을 받아서 상태를 업데이트.
  const handleBoxClick = (type: SchedulePhotoType) => {
    setLocalSelectedPhotoBoxType(type)
  }
  const handleNext = () => {
    switch (localSelectedPhotoBoxType) {
      case 'Gallery':
        analyzeScheduleImage()
        break
      case 'Camera':
        openCameraImage()
        break
    }
  }

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      className="flex-1 bg-background-gray-subtle1 px-p-7"
    >
      <View className="flex-1">
        <Text className="mb-5 mt-[9px] text-start heading-m">
          인식할 근무표를 등록해주세요.
        </Text>

        <RegMethod<SchedulePhotoType>
          type="Gallery"
          isSelected={localSelectedPhotoBoxType === 'Gallery'}
          onPress={handleBoxClick}
          Icon={OpenGallery}
          title="갤러리에서 사진 선택"
          subtitle="이미 저장된 근무표 이미지를 불러올 수 있어요."
        />
        <RegMethod<SchedulePhotoType>
          type="Camera"
          isSelected={localSelectedPhotoBoxType === 'Camera'}
          onPress={handleBoxClick}
          Icon={TakePicture}
          title="카메라로 촬영하기"
          subtitle="지금 바로 사진을 찍어서 업로드 할 수 있어요."
        />
      </View>
      <ProgressModal isVisible={isAnalyzing} />

      <EmphasizedButton
        content={
          <GlobalText className="font-pretMedium text-body-m text-text-bolder-inverse">
            다음
          </GlobalText>
        }
        onPress={handleNext}
      />
    </SafeAreaView>
  )
}

export default SelectPhotoOCRScreen
