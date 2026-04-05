import { create } from 'zustand'
import {
  OnboardingMethod,
  OnboardingStep,
} from '../presentation/onboarding/types/onboardingTypes'
import { ScheduleScope } from '../presentation/onboarding/types/scheduleTypes'
import { Asset } from 'react-native-image-picker'
import { OcrResult } from '../domain/models/OcrResult'
import { ocrRepository } from '../infrastructure/di/Dependencies'

const OCR_PROGRESS_MAX_PERCENT = 95
const OCR_PROGRESS_INTERVAL_MS = 180
const OCR_PROGRESS_MIN_VISIBLE_MS = 900
const OCR_PROGRESS_COMPLETE_MS = 520

let ocrProgressTimer: ReturnType<typeof setInterval> | null = null
let ocrProgressRunId = 0

const wait = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms)
  })

const clearOcrProgressTimer = () => {
  if (ocrProgressTimer) {
    clearInterval(ocrProgressTimer)
    ocrProgressTimer = null
  }
}

const getNextOcrProgress = (currentProgress: number) => {
  if (currentProgress >= OCR_PROGRESS_MAX_PERCENT) {
    return OCR_PROGRESS_MAX_PERCENT
  }

  let nextProgress = currentProgress

  if (currentProgress < 18) {
    nextProgress += 5
  } else if (currentProgress < 42) {
    nextProgress += 3.6
  } else if (currentProgress < 68) {
    nextProgress += 2.4
  } else if (currentProgress < 84) {
    nextProgress += 1.4
  } else {
    nextProgress += 0.8
  }

  return Math.min(nextProgress, OCR_PROGRESS_MAX_PERCENT)
}

/**
 * ## OnboardingState
 *
 * 온보딩 관련 상태를 관리하는 전역 상태
 *
 *
 * @property onboardingMethod - 온보딩 방식 - OCR, NEW, DIRECT, EXISTING_OCR(근무표가 이미 있는 경우 OCR)
 * @property currentStep - 현재 온보딩 단계
 * @property scheduleScope - 근무표 범위 설정 - 전체 / 개인
 * @property isOcrAnalyzing - OCR 분석 중 여부
 * @property ocrProgressPercent - OCR 진행 퍼센트
 * @property isOcrProgressCompleting - OCR 진행 마무리 애니메이션 여부
 * @property ocrResult - OCR 분석 결과
 * @property ocrError - OCR 분석 에러
 *
 * @method setOnboardingMethod - 온보딩 방식 설정
 * @method setOnboardingState - 온보딩 단계 설정
 * @method setScheduleScope - 근무표 범위 설정
 * @method analyzeScheduleImage - OCR 분석
 * @method clearOcrResult - OCR 분석 결과 초기화
 */
interface OnboardingState {
  onboardingMethod: OnboardingMethod

  currentStep: OnboardingStep

  scheduleScope: ScheduleScope

  isOcrAnalyzing: boolean

  ocrProgressPercent: number

  isOcrProgressCompleting: boolean

  ocrResult: OcrResult | null

  ocrError: string | null

  setOnboardingMethod: (method: OnboardingMethod) => void

  setOnboardingState: (method: OnboardingMethod, step: OnboardingStep) => void

  setScheduleScope: (scope: ScheduleScope) => void

  analyzeScheduleImage: (asset: Asset) => Promise<void>

  clearOcrResult: () => void
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  onboardingMethod: 'OCR',

  currentStep: OnboardingStep.SelectScheduleScope,

  scheduleScope: 'ALL',

  isOcrAnalyzing: false,

  ocrProgressPercent: 0,

  isOcrProgressCompleting: false,

  ocrResult: null,

  ocrError: null,

  setOnboardingMethod: (method: OnboardingMethod) =>
    set(() => ({ onboardingMethod: method })),

  setOnboardingState: (method: OnboardingMethod, step: OnboardingStep) =>
    set(() => ({ onboardingMethod: method, currentStep: step })),

  setScheduleScope: (scope: ScheduleScope) =>
    set(() => ({ scheduleScope: scope })),

  analyzeScheduleImage: async (asset: Asset) => {
    const currentRunId = ++ocrProgressRunId
    const startedAt = Date.now()

    clearOcrProgressTimer()

    set({
      isOcrAnalyzing: true,
      ocrProgressPercent: 0,
      isOcrProgressCompleting: false,
      ocrError: null,
      ocrResult: null,
    })

    const intervalId = setInterval(() => {
      if (currentRunId !== ocrProgressRunId) {
        clearInterval(intervalId)
        if (ocrProgressTimer === intervalId) {
          ocrProgressTimer = null
        }
        return
      }

      const { isOcrAnalyzing, isOcrProgressCompleting, ocrProgressPercent } =
        get()

      if (!isOcrAnalyzing || isOcrProgressCompleting) {
        return
      }

      const nextProgress = getNextOcrProgress(ocrProgressPercent)

      if (nextProgress !== ocrProgressPercent) {
        set({ ocrProgressPercent: nextProgress })
      }
    }, OCR_PROGRESS_INTERVAL_MS)

    ocrProgressTimer = intervalId

    let ocrResult: OcrResult | null = null
    let ocrError: string | null = null

    try {
      ocrResult = (await ocrRepository.getVisionResult(asset)) ?? null

      if (!ocrResult) {
        ocrError =
          '근무표가 제대로 인식되지 않았어요. 다른 사진으로 다시 시도해주세요.'
      }
    } catch (error) {
      ocrError = error instanceof Error ? error.message : String(error)
    }

    const remainingVisibleTime =
      OCR_PROGRESS_MIN_VISIBLE_MS - (Date.now() - startedAt)

    if (remainingVisibleTime > 0) {
      await wait(remainingVisibleTime)
    }

    if (currentRunId !== ocrProgressRunId) {
      return
    }

    clearOcrProgressTimer()

    set({
      ocrResult,
      ocrError,
      isOcrProgressCompleting: true,
      ocrProgressPercent: 100,
    })

    await wait(OCR_PROGRESS_COMPLETE_MS)

    if (currentRunId !== ocrProgressRunId) {
      return
    }

    set({
      isOcrAnalyzing: false,
      isOcrProgressCompleting: false,
    })
  },

  clearOcrResult: () => {
    ocrProgressRunId += 1
    clearOcrProgressTimer()

    set({
      ocrResult: null,
      ocrError: null,
      isOcrAnalyzing: false,
      ocrProgressPercent: 0,
      isOcrProgressCompleting: false,
    })
  },
}))
