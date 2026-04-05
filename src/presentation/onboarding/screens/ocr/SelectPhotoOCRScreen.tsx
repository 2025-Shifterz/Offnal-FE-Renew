import React, { useState } from 'react'
import { View, Text, Platform } from 'react-native'
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
import ProgressModal from '../../../../shared/components/progress/ProgressModal'
import goNextOnboadingScreen from '../../flow/goNextOnboardingScreen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useOnboardingStore } from '../../../../store/useOnboardingStore'
import { OnboardingStep } from '../../types/onboardingTypes'
import { SchedulePhotoType } from '../../types/scheduleTypes'
import { OnboardingRoute } from '../../../../navigation/types/OnboardingRoute'
import EmphasizedButton from '../../../../shared/components/button/Button'
import GlobalText from '../../../../shared/components/text/GlobalText'
import { useShallow } from 'zustand/shallow'
import {
  ErrorDialog,
  PermissionConfirmDialog,
  PermissionNeededDialog,
} from '../../component/OnboardingDialogs'

type ScheduleInfoInputRouteProp = RouteProp<
  OnboardingStackParamList,
  'SelectPhotoOCR'
>

const SelectPhotoOCRScreen = () => {
  const navigation = useNavigation<{
    navigate: (route: OnboardingRoute) => void
  }>()
  const insets = useSafeAreaInsets()
  const route = useRoute<ScheduleInfoInputRouteProp>()
  const { year, month } = route.params

  const [isPermissionDialogVisible, setIsPermissionDialogVisible] =
    useState(false)
  const [isPermissionNeededDialogVisible, setIsPermissionNeededDialogVisible] =
    useState(false)
  const [isCameraErrorDialogVisible, setIsCameraErrorDialogVisible] =
    useState(false)
  const [isOcrFailedDialogVisible, setIsOcrFailedDialogVisible] =
    useState(false)
  const [localSelectedPhotoBoxType, setLocalSelectedPhotoBoxType] =
    useState<SchedulePhotoType>('Gallery')

  const {
    onboardingMethod,
    isOcrAnalyzing,
    ocrProgressPercent,
    analyzeScheduleImage,
    clearOcrResult,
  } = useOnboardingStore(
    useShallow(state => ({
      onboardingMethod: state.onboardingMethod,
      isOcrAnalyzing: state.isOcrAnalyzing,
      ocrProgressPercent: state.ocrProgressPercent,
      analyzeScheduleImage: state.analyzeScheduleImage,
      clearOcrResult: state.clearOcrResult,
    }))
  )

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

      if (status !== RESULTS.GRANTED) {
        allGranted = false
        if (
          status === RESULTS.BLOCKED ||
          (Platform.OS === 'ios' && status === RESULTS.DENIED)
        ) {
          setIsPermissionDialogVisible(true)

          return false
        } else {
          setIsPermissionNeededDialogVisible(true)
          return false
        }
      }
    }

    return allGranted
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
      handleOcrResult
    )
  }

  const openGalleryImage = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        quality: 1,
      },
      handleOcrResult
    )
  }

  async function handleOcrResult(response: ImagePickerResponse) {
    if (response.didCancel) return
    if (response.errorCode) {
      setIsCameraErrorDialogVisible(true)
      return
    }

    const asset = response.assets?.[0]
    if (!asset) return

    await analyzeScheduleImage(asset)

    const { ocrResult, ocrError } = useOnboardingStore.getState()

    if (ocrError) {
      setIsOcrFailedDialogVisible(true)
      return
    }

    if (!ocrResult) {
      setIsOcrFailedDialogVisible(true)
      return
    }

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
  }

  const handleBoxClick = (type: SchedulePhotoType) => {
    setLocalSelectedPhotoBoxType(type)
  }

  const handleNext = () => {
    clearOcrResult()

    switch (localSelectedPhotoBoxType) {
      case 'Gallery':
        openGalleryImage()
        break
      case 'Camera':
        openCameraImage()
        break
    }
  }

  return (
    <View className="flex-1 bg-background-gray-subtle1 px-p-7">
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

      <View style={{ paddingBottom: insets.bottom }}>
        <EmphasizedButton
          content={
            <GlobalText className="font-pretMedium text-body-m text-text-bolder-inverse">
              다음
            </GlobalText>
          }
          onPress={handleNext}
        />
      </View>

      <ProgressModal
        isVisible={isOcrAnalyzing}
        progressPercent={ocrProgressPercent}
      />

      <PermissionConfirmDialog
        isVisible={isPermissionDialogVisible}
        onConfirm={() => {
          openSettings()
          setIsPermissionDialogVisible(false)
        }}
        onCancel={() => {
          setIsPermissionDialogVisible(false)
        }}
      />

      <PermissionNeededDialog
        isVisible={isPermissionNeededDialogVisible}
        onConfirm={() => {
          setIsPermissionNeededDialogVisible(false)
        }}
      />

      <ErrorDialog
        isVisible={isOcrFailedDialogVisible}
        title="인식 실패"
        description="근무표가 제대로 인식되지 않았어요. 다른 사진으로 다시 시도해주세요."
        onConfirm={() => {
          setIsOcrFailedDialogVisible(false)
        }}
      />

      <ErrorDialog
        isVisible={isCameraErrorDialogVisible}
        title="카메라 오류"
        description="카메라 사용 중 오류가 발생했어요. 다시 시도해주세요."
        onConfirm={() => {
          setIsCameraErrorDialogVisible(false)
        }}
      />
    </View>
  )
}

export default SelectPhotoOCRScreen
