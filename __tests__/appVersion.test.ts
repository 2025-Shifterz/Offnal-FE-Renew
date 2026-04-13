import versionConfig from '../version.json'
import packageJson from '../package.json'
import appVersion from '../src/shared/config/appVersion'

describe('appVersion', () => {
  it('derives the marketing version from version.json', () => {
    expect(appVersion.yearMonth).toBe(versionConfig.yearMonth)
    expect(appVersion.buildNumber).toBe(versionConfig.buildNumber)
    expect(appVersion.marketingVersion).toBe(
      `${versionConfig.yearMonth}.${String(versionConfig.buildNumber).padStart(
        3,
        '0'
      )}`
    )
  })

  it('derives the build code from the year.month and build number', () => {
    const [yearPart, monthPart] = versionConfig.yearMonth.split('.')
    const year = Number(yearPart)
    const month = Number(monthPart)

    expect(packageJson.version).toBe(
      `${year}.${month}.${versionConfig.buildNumber}`
    )

    expect(appVersion.versionCode).toBe(
      year * 100000 + month * 1000 + versionConfig.buildNumber
    )
  })
})
