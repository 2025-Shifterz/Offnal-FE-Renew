import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import WebView from 'react-native-webview'
import { rootNavigation } from '../../../navigation/types/StackTypes'

type TermsWebViewScreenRouteProps = RouteProp<{
  params: {
    url: string
    title: string
  }
}>

const TermsWebViewScreen = () => {
  const { params } = useRoute<TermsWebViewScreenRouteProps>()

  return (
    <SafeAreaView className="flex-1" edges={[]}>
      <WebView source={{ uri: params.url }} />
    </SafeAreaView>
  )
}

export default TermsWebViewScreen
