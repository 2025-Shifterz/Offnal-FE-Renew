import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { InfoStackParamList } from '../../../navigation/types'
import { Alert } from 'react-native'

const ShowLogOutAlert = (onLogOut: () => void) => {
  Alert.alert(
    '로그아웃',
    '정말로 로그아웃 하시겠습니까?',
    [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: () => {
          onLogOut()
        },
        style: 'destructive',
      },
    ],
    { cancelable: false }
  )
}

export default ShowLogOutAlert
