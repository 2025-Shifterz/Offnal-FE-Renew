import { Text, View } from 'react-native'
import PolicyHeader from '../components/CommonHeader'
import ServiceTermText from '../components/ServiceTermText'
import { SafeAreaView } from 'react-native-safe-area-context'

const ServiceTerm = () => {
  return (
    <SafeAreaView className="flex-1">
      <PolicyHeader headerText="서비스 이용약관" />
      <ServiceTermText />
    </SafeAreaView>
  )
}
export default ServiceTerm
