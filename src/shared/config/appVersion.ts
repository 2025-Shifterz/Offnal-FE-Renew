import versionConfig from '../../../version.json'
import { getVersionSnapshot } from './versionUtils'

type VersionConfig = {
  buildNumber: number
  yearMonth: string
}
const normalizedVersionConfig = versionConfig as VersionConfig
const snapshot = getVersionSnapshot(normalizedVersionConfig)

export type AppVersion = {
  buildNumber: number
  marketingVersion: string
  versionCode: number
  yearMonth: string
}

export const appVersion: AppVersion = {
  buildNumber: snapshot.buildNumber,
  marketingVersion: snapshot.marketingVersion,
  versionCode: snapshot.versionCode,
  yearMonth: snapshot.yearMonth,
}

export const appVersionLabel = snapshot.marketingVersion

export default appVersion
