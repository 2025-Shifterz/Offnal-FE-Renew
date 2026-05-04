import { ReactNode } from 'react'
import { View } from 'react-native'
import GlobalText from './text/GlobalText'

const Pill = ({ children }: { children: ReactNode }) => (
  <View className="rounded-radius-max border border-surface-gray-subtle2 bg-surface-gray-subtle1 px-[12px] py-[5px]">
    <GlobalText className="text-heading-xxxxs text-text-subtle">
      {children}
    </GlobalText>
  </View>
)

export default Pill
