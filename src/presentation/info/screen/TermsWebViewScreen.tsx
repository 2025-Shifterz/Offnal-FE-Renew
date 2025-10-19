import { RouteProp, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopAppBar from '../../../shared/components/TopAppBar'
import WebView from 'react-native-webview'

type TermsWebViewScreenRouteProps = RouteProp<{
  params: {
    url: string
    title: string
  }
}>

const TermsWebViewScreen = () => {
  const { params } = useRoute<TermsWebViewScreenRouteProps>()

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <TopAppBar title={params.title} />
      <WebView source={{ uri: params.url }} />
    </SafeAreaView>
  )
}

export default TermsWebViewScreen
