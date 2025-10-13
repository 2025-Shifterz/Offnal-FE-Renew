import { View } from 'react-native'
import PolicyHeader from '../components/CommonHeader'
import PrivacyPolicyText from '../components/PrivacyPolicyText'
import { SafeAreaView } from 'react-native-safe-area-context'

const PrivacyPolicy = () => {
  return (
    <SafeAreaView className="flex-1">
      <PolicyHeader headerText="개인 정보 처리 방침" />
      <PrivacyPolicyText />
    </SafeAreaView>
  )
}
export default PrivacyPolicy
