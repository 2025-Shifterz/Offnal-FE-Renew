import { View } from 'react-native'
import GlobalText from '../GlobalText'

const RATING_DATA: Record<number, { emoji: string; text: string }> = {
  1: { emoji: '😞', text: '매우 불만족' },
  2: { emoji: '😕', text: '불만족' },
  3: { emoji: '🙂', text: '보통' },
  4: { emoji: '😊', text: '만족' },
  5: { emoji: '🥰', text: '매우 만족' },
}

const RATING_CHIP_STYLE: Record<number, { bg: string; border: string }> = {
  1: { bg: 'bg-surface-danger-subtle', border: 'border-[#F05F424D]' },
  2: { bg: 'bg-surface-warning-subtle', border: 'border-[#C785004D]' },
  3: { bg: 'bg-surface-secondary-subtle', border: 'border-[#EEE1474D]' },
  4: { bg: 'bg-surface-success-subtle', border: 'border-[#3FA6544D]' },
  5: { bg: 'bg-surface-information-subtle', border: 'border-[#2098F34D]' },
}

const RatingChip = ({ rating }: { rating: number }) => {
  const { bg, border } = RATING_CHIP_STYLE[rating]
  const { emoji, text } = RATING_DATA[rating]

  return (
    <View
      className={`rounded-radius-max border ${border} ${bg} px-number-6 py-number-3`}
    >
      <GlobalText className="font-pretMedium text-body-xxs">
        {emoji} {text}
      </GlobalText>
    </View>
  )
}

export default RatingChip
