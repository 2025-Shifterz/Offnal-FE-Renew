import { View, Text, LayoutChangeEvent } from 'react-native'
import SneakersIcon from '../../../assets/icons/ic_sneakers_24.svg'
import WeightIcon from '../../../assets/icons/ic_weight_24.svg'
import { LineChart } from 'react-native-chart-kit'
import { useState } from 'react'

const Walk = () => {
  const weeklySteps = [
    0, // Day 1
    0, // Day 2
    0, // Day 3
    0, // Day 4
    0, // Day 5 (Today's value could be the last one, or you can pass it separately)
    0, // Day 6
    0, // Day 7
  ]

  const maxSteps = Math.max(...weeklySteps)
  const safeMaxSteps = maxSteps === 0 ? 1 : maxSteps

  return (
    <View className="flex-1 items-start justify-center rounded-lg bg-surface-white px-number-6 py-number-8">
      <View className="mb-number-3 flex-row items-center justify-center">
        <SneakersIcon />
        <Text className="ps-number-3 text-text-subtle heading-xxxs">
          걸음 수
        </Text>
      </View>

      <Text className="text-text-bolder heading-s">0 걸음</Text>
      <View className="mb-number-8 flex-row items-center justify-center">
        <Text className="text-text-subtle label-xxs">어제 보다</Text>
        <Text className="ms-number-2 text-text-information label-xxs">▲ 0</Text>
      </View>
      <View className="h-number-16 max-w-[88px] flex-row items-end justify-around">
        {weeklySteps.map((steps, index) => (
          <View
            key={index}
            className="mx-number-3 flex-1 justify-end rounded-full bg-background-gray-subtle2"
          >
            <View
              className="w-full rounded-full bg-text-primary"
              style={{ height: `${(steps / safeMaxSteps) * 80 + 5}%` }}
            />
          </View>
        ))}
      </View>
    </View>
  )
}

const Weight = () => {
  const [chartCalculatedWidth, setChartCalculatedWidth] = useState(0)

  // onLayout for the main card View to get its internal content width
  const onCardLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    // Calculate the available width for the chart within the card.
    // Card has `px-number-6` (24px left + 24px right = 48px padding)
    const availableWidth = width - 10 * 2
    setChartCalculatedWidth(availableWidth)
  }

  const weightData = {
    labels: ['월', '화', '수', '목', '금', '토', '일'], // 1주일 요일
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0], // 실제 몸무게 데이터 (예시)
        color: (opacity = 1) => `rgba(158, 158, 158, ${opacity})`, // 라인 색상 (회색 계열)
        strokeWidth: 2, // 라인 두께
      },
    ],
  }

  const chartConfig = {
    backgroundGradientFrom: '#ffffff', // 배경 그라데이션 시작 색상 (흰색)
    backgroundGradientTo: '#ffffff', // 배경 그라데이션 끝 색상 (흰색)
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.3})`, // 그리드 라인 및 텍스트 색상
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.6})`, // 라벨 색상
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '3',
      strokeWidth: '1',
      stroke: '#43cfdf',
      fill: '#ffffff',
    },
    fillShadowGradient: '#FFFFFF',
    fillShadowGradientTo: '#2ECADC',
    fillShadowGradientOpacity: 0.1,
    bezier: true,
  }

  return (
    <View
      className="flex-1 items-start justify-center rounded-lg bg-surface-white px-number-6 py-number-8"
      onLayout={onCardLayout}
    >
      <View className="mb-number-3 flex-row items-center justify-center">
        <WeightIcon />
        <Text className="ps-number-3 text-text-subtle heading-xxxs">
          몸무게 기록
        </Text>
      </View>

      <Text className="mb-number-3 text-text-bolder heading-s">기록없음</Text>
      <LineChart
        data={weightData}
        width={chartCalculatedWidth}
        height={74} // 차트의 높이
        chartConfig={chartConfig}
        bezier
        withDots={true} // 데이터 포인트에 점 표시 여부 (이미지에는 점이 없음)
        withShadow={true} // 라인 아래 그림자 표시 여부
        withVerticalLines={true} // 세로 그리드 라인 표시 안함
        withHorizontalLines={true} // 가로 그리드 라인 표시
        withHorizontalLabels={false}
        withVerticalLabels={false}
        renderDotContent={({ x, y, index, indexData }) => {
          return null
        }}
        style={{}}
      />
    </View>
  )
}

export default { Walk, Weight }
