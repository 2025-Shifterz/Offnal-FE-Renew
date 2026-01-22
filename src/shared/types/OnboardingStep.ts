export enum OnboardingStep {
  SelectScheduleScope = 'SelectScheduleScope', // 전체/개인
  InputSchedule = 'InputSchedule', // 근무표 기본 정보 입력

  // OCR 화면 --
  SelectMonthOCR = 'SelectMonthOCR', // OCR 달력 선택
  SelectPhotoOCR = 'SelectPhotoOCR', // OCR 사진 선택
  EditScheduleOCR = 'EditScheduleOCR', // OCR 근무표 편집
  // --

  InputCalendarType = 'InputCalendarType', // 달력에 근무 형태 입력
  CompleteSchedule = 'CompleteSchedule', // 근무표 등록 완료
}
