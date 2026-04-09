import versionConfig from '../../../version.json'

type VersionConfig = {
  buildNumber: number
  yearMonth: string
}

const versionMonthPattern = /^\d{4}\.\d{2}$/

const normalizedVersionConfig = versionConfig as VersionConfig

if (!versionMonthPattern.test(normalizedVersionConfig.yearMonth)) {
  throw new Error(
    `[appVersion] Invalid yearMonth "${normalizedVersionConfig.yearMonth}".`
  )
}

if (
  !Number.isInteger(normalizedVersionConfig.buildNumber) ||
  normalizedVersionConfig.buildNumber < 1 ||
  normalizedVersionConfig.buildNumber > 999
) {
  throw new Error(
    `[appVersion] Invalid buildNumber "${normalizedVersionConfig.buildNumber}".`
  )
}

const [yearPart, monthPart] = normalizedVersionConfig.yearMonth.split('.')
const year = Number(yearPart)
const month = Number(monthPart)

if (!Number.isInteger(year) || !Number.isInteger(month)) {
  throw new Error(
    `[appVersion] Invalid yearMonth "${normalizedVersionConfig.yearMonth}".`
  )
}

const marketingVersion = `${normalizedVersionConfig.yearMonth}.${String(
  normalizedVersionConfig.buildNumber
).padStart(3, '0')}`
const versionCode =
  year * 100000 + month * 1000 + normalizedVersionConfig.buildNumber

export type AppVersion = {
  buildNumber: number
  marketingVersion: string
  versionCode: number
  yearMonth: string
}

export const appVersion: AppVersion = {
  buildNumber: normalizedVersionConfig.buildNumber,
  marketingVersion,
  versionCode,
  yearMonth: normalizedVersionConfig.yearMonth,
}

export const appVersionLabel = marketingVersion

export default appVersion
