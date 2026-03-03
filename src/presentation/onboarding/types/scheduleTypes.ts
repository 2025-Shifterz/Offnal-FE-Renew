/**
 * ### SchedulePhotoType
 *
 * 근무표 사진 촬영 방식
 *
 * @enum
 * @property {string} Gallery - 갤러리
 * @property {string} Camera - 카메라
 */
export type SchedulePhotoType = 'Gallery' | 'Camera'

/**
 * ### ScheduleScope
 *
 * 근무표 범위
 *
 * @enum
 * @property {string} ALL - 전체 근무표
 * @property {string} MY - 내 근무표
 */
export type ScheduleScope = 'ALL' | 'MY'
