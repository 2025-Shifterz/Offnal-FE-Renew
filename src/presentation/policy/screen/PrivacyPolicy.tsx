import { View } from 'react-native'
import PolicyHeader from '../components/CommonHeader'
import PrivacyPolicyText from '../components/PrivacyPolicyText'

const PrivacyPolicy = () => {
  return (
    <View className="flex-1">
      <PolicyHeader headerText="개인 정보 처리 방침" />
      <PrivacyPolicyText />
    </View>
  )
}
export default PrivacyPolicy
