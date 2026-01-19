import React, {
  useEffect,
  useImperativeHandle,
  useState,
  ForwardRefRenderFunction,
  forwardRef,
} from 'react'
import { View } from 'react-native'
import dayjs from 'dayjs'
import TCalendarBase from './TCalendarBase'
import TeamTypeSelect from './TeamTypeSelect'
import { TimeFrameChildren } from '../TimeFrame'
import { useTeamCalendarStore } from '../../../../store/useTeamCalendarStore'
import { convertEndTimeToDuration } from '../../../utils/calendar/convertDuration'
import { fromShiftType } from '../../../../data/mappers/ShiftTypeMapper'
import {
  calendarRepository,
  teamCalendarRepository,
} from '../../../../infrastructure/di/Dependencies'
import { CreateCalendarRequest } from '../../../../infrastructure/remote/request/CreateWorkCalendarRequest'
import { useScheduleInfoStore } from '../../../../store/useScheduleInfoStore'
import { all } from 'axios'
import { useOnboardingStore } from '../../../../store/useOnboardingStore'
import { mergeTeamCalendars } from '../../../utils/calendar/mergeTeamCalendars'
import { UpdateTeamShiftsRequest } from '../../../../infrastructure/remote/request/PatchTeamWorkCalendarRequest'

export interface TCalendarEditorRef {
  postData: () => void
}

const TCalendarEditor: ForwardRefRenderFunction<
  TCalendarEditorRef,
  {
    currentDate: dayjs.Dayjs
  }
> = ({ currentDate }, ref) => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)

  const {
    teamCalendarData,
    newTeamCalendarData,
    updateTeamCalendarDay,
    clearNewTeamCalendarData,
    fetchTeamCalendarData,
  } = useTeamCalendarStore()

  const { onboardingMethod } = useOnboardingStore()
  const { workTimes, workGroup, organizationName } = useScheduleInfoStore()

  const startDate = `${currentDate.year()}-${String(currentDate.month() + 1).padStart(2, '0')}-01`
  const endDate = dayjs(startDate).endOf('month').format('YYYY-MM-DD')
  // 처음에 기존 값 조회//
  useEffect(() => {
    if (onboardingMethod === 'OCR') {
      clearNewTeamCalendarData()
    } else if (onboardingMethod === 'EXISTING_OCR') {
      // 기존 근무표가 있는 경우, 기존 근무표로 초기화
      async function fetchData() {
        await fetchTeamCalendarData(organizationName, startDate, endDate)
      }
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  // 날짜 선택
  const handleDatePress = (date: dayjs.Dayjs) => {
    setSelectedDate(date)
  }

  // 해당 조!!!에 근무 형태 추가
  const handleTypeSelect = (team: string, type: TimeFrameChildren) => {
    if (!selectedDate) return
    const date = selectedDate.format('YYYY-MM-DD')

    // store에 직접 업데이트
    updateTeamCalendarDay({
      team,
      date,
      workTypeName: type,
    })
  }

  // CalendarEditor와 동일 - 커스텀 훅으로 빼야 할 듯
  const [convertedWorkTimes, setConvertedWorkTimes] = useState({
    D: { startTime: '08:00', duration: 'PT8H' },
    E: { startTime: '16:00', duration: 'PT8H' },
    N: { startTime: '00:00', duration: 'PT8H' },
  })

  // workTimes 에서 endTime -> duration 변환
  useEffect(() => {
    if (!workTimes) return
    const converted = convertEndTimeToDuration(workTimes)
    setConvertedWorkTimes(converted)
  }, [workTimes])

  // --------------

  // 기존 + 새로 편집한 데이터 합치기
  const allTeamCalendarData = mergeTeamCalendars(
    teamCalendarData,
    newTeamCalendarData
  )
  console.log('합쳐진 allTeamCalendarData:', allTeamCalendarData)

  // 부모에서 호출할 수 있는 함수 정의
  useImperativeHandle(ref, () => ({
    postData: async () => {
      try {
        // 모든 팀의 날짜를 flatten
        const allDates = allTeamCalendarData.flatMap(teamRecord =>
          Object.keys(teamRecord.workInstances)
        )

        // YYYY-MM 단위로 중복 제거하고 정렬
        const storedMonths = Array.from(
          new Set(allDates.map(dateStr => dayjs(dateStr).format('YYYY-MM')))
        ).sort()

        if (storedMonths.length === 0) {
          console.warn('저장된 근무 데이터가 없습니다.')
          return
        }

        // 팀별로 shifts 생성
        const newTeamCalendars: CreateCalendarRequest['calendars'] =
          allTeamCalendarData.map(teamRecord => {
            const shifts: Record<string, string> = {}
            Object.entries(teamRecord.workInstances).forEach(([date, work]) => {
              shifts[date] = fromShiftType(work.workTypeName)
            })

            return {
              organizationName,
              team: teamRecord.team,
              shifts,
            }
          })
        console.log('생성된 새 팀 calendars 데이터:', newTeamCalendars)

        const newCalendarRequest: CreateCalendarRequest = {
          myTeam: workGroup,
          workTimes: convertedWorkTimes,
          calendars: newTeamCalendars,
        }
        const updatedRequest: UpdateTeamShiftsRequest = {
          calendars: allTeamCalendarData.map(cal => ({
            team: cal.team,
            shifts: Object.fromEntries(
              Object.entries(cal.workInstances).map(([date, work]) => [
                date,
                fromShiftType(work.workTypeName), // string으로 변환
              ])
            ),
          })),
        }

        // API 호출
        let res
        if (onboardingMethod === 'EXISTING_OCR') {
          console.log('요청하는 팀 근무표 수정 데이터:', updatedRequest)
          console.log('organization name:', organizationName)
          res = await teamCalendarRepository.updateTeamCalendar(
            organizationName,
            updatedRequest
          )
        } else {
          console.log('요청하는 팀 근무표 등록 데이터:', newCalendarRequest)
          res = await calendarRepository.createCalendar(newCalendarRequest)
        }
        console.log('근무표 저장 성공:', res)

        console.log('저장된 teamCalendarData의 년/월 목록:', storedMonths)
      } catch (error) {
        console.error('팀 근무표 저장 실패:', error)
      }
    },
  }))

  return (
    <View>
      <TCalendarBase
        currentDate={currentDate}
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
        teamCalendarData={allTeamCalendarData}
        myTeam={workGroup}
      />
      <TeamTypeSelect onPressSelect={handleTypeSelect} />
    </View>
  )
}

export default forwardRef(TCalendarEditor)
