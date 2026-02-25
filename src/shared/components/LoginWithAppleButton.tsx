import React from 'react'
import { View } from 'react-native'
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication'

export async function onAppleButtonPress() {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    })

    const { user, email, fullName, identityToken, authorizationCode } =
      appleAuthRequestResponse

    const credentialState = await appleAuth.getCredentialStateForUser(user)

    if (credentialState === appleAuth.State.AUTHORIZED) {
      console.log('로그인 성공:', user)
      console.log('Identity Token:', identityToken)
      console.log('Authorization Code:', authorizationCode)
      console.log('이메일:', email)
      console.log('이름:', fullName)
    }
  } catch (error) {
    if (error === appleAuth.Error.CANCELED) {
      console.log('유저가 취소함')
    } else {
      console.error(error)
    }
  }
}

export default function AppleLoginScreen() {
  return (
    <View>
      <AppleButton
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.SIGN_IN}
        style={{
          width: 160,
          height: 45,
        }}
        onPress={() => onAppleButtonPress()}
      />
    </View>
  )
}
