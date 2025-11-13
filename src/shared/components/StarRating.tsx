import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import IcStarGray from '../../assets/icons/ic_star_gray.svg'
import IcStarYellow from '../../assets/icons/ic_star_yellow.svg'

interface StarRatingProps {
  rating: number
  onRatingChange: (newRating: number) => void
  maxStars?: number
  starSize?: number
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  maxStars = 5,
  starSize = 40,
}) => {
  const renderStar = (index: number) => {
    const isFilled = index <= rating
    const StarIcon = isFilled ? IcStarYellow : IcStarGray

    return (
      <TouchableOpacity
        key={index}
        onPress={() => onRatingChange(index)}
        activeOpacity={0.7}
      >
        <StarIcon width={starSize} height={starSize} />
      </TouchableOpacity>
    )
  }

  return (
    <View className="flex-row">
      {Array.from({ length: maxStars }, (_, i) => i + 1).map(renderStar)}
    </View>
  )
}

export default StarRating
