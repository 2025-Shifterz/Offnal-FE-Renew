import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import React from 'react'
import CenterAlignedTopAppBar from '../../shared/components/appbar/CenterAlignedTopAppBar'
import TopAppBarBackButton from '../../shared/components/button/TopAppBarBackButton'
import GlobalText from '../../shared/components/text/GlobalText'

type HeaderNavigation = {
  goBack: () => void
}

type BackHeaderOptions = {
  backgroundColor?: string
}

export const makeBackHeaderOptions =
  (
    title: string | null,
    options: BackHeaderOptions = {}
  ): ((props: {
    navigation: HeaderNavigation
  }) => NativeStackNavigationOptions) =>
  ({ navigation }) => ({
    header: () => (
      <CenterAlignedTopAppBar
        navigationIcon={<TopAppBarBackButton onPress={navigation.goBack} />}
        title={
          title ? (
            <GlobalText className="font-pretSemiBold text-heading-xs">
              {title}
            </GlobalText>
          ) : null
        }
        applySafeArea={true}
        backgroundColor={options.backgroundColor}
      />
    ),
    headerShown: true,
    headerShadowVisible: false,
  })

export const emptyHeaderOptions: NativeStackNavigationOptions = {
  header: () => (
    <CenterAlignedTopAppBar
      navigationIcon={null}
      title={null}
      applySafeArea={true}
    />
  ),
  headerShown: true,
  headerShadowVisible: false,
}
