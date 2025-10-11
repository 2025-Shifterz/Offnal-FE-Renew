import { Text, View } from 'react-native'
import PolicyHeader from '../components/CommonHeader'
import ServiceTermText from '../components/ServiceTermText'

const ServiceTerm = () => {
  return (
    <View className="flex-1">
      <PolicyHeader headerText="서비스 이용약관" />
      <ServiceTermText />
    </View>
  )
}
export default ServiceTerm
