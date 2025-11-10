import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import GlobalText from '../../../shared/components/GlobalText'
import HomeWorkTypeChip from './HomeWorkTypeChip'
import { HomeResponse } from '../../../infrastructure/remote/response/homeResponse'
import SealImg from '../../../assets/images/seal-character.svg'
import BellIcon from '../../../assets/icons/ic_home_bell_24.svg'

const TopBanner = () => {
  const [homeData, setHomeData] = useState<HomeResponse['data'] | null>(null)
  const today = new Date()
  const formattedDate = `${today.getMonth() + 1}월 ${today.getDate()}일 (${['일', '월', '화', '수', '목', '금', '토'][today.getDay()]})`

  const translateWorkType = (type?: string): string => {
    if (!type) return '미등록'
    switch (type) {
      case 'DAY':
        return '주간'
      case 'EVENING':
        return '오후'
      case 'NIGHT':
        return '야간'
      case 'OFF':
        return '휴일'
      default:
        return '미등록'
    }
  }
  return (
    <View className="mx-[20px] flex-col bg-surface-disabled-inverse pb-[20px]">
      <View className="h-[50px] justify-center">
        <View className="flex-row justify-between">
          <GlobalText className="text-surface-white heading-xxs">
            {formattedDate}
          </GlobalText>
          <TouchableOpacity>
            <BellIcon />
          </TouchableOpacity>
        </View>
      </View>
      <View className="mb-[15px] flex-row justify-between py-p-5">
        <View>
          <GlobalText className="mb-[4px] text-text-basic-inverse body-s">
            지금은 집중력이 떨어질 수 있어요.
          </GlobalText>

          <GlobalText className="mb-[2px] text-surface-primary heading-s">{`가벼운 스트레칭과`}</GlobalText>
          <View className="flex-row">
            <GlobalText className="mb-[2px] text-surface-primary heading-s">{`물 한잔`}</GlobalText>
            <GlobalText className="text-surface-gray-subtle1 heading-s">{`을 추천드려요!`}</GlobalText>
          </View>
        </View>
        <View className=" ">
          <SealImg />
        </View>
      </View>
      <View className="">
        <HomeWorkTypeChip
          workType={
            homeData && homeData.todayType
              ? translateWorkType(homeData.todayType)
              : '미등록'
          }
        />
      </View>
    </View>
  )
}

export default TopBanner
