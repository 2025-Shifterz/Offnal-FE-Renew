/**
 * @typedef {Object} VersionConfig
 * @property {string} yearMonth
 * @property {number} buildNumber
 *
 * @typedef {VersionConfig & {
 *   marketingVersion: string
 *   packageVersion: string
 *   versionCode: number
 * }} VersionSnapshot
 */

const VERSION_MONTH_PATTERN = /^\d{4}\.\d{2}$/

/**
 * @param {VersionConfig} versionConfig
 * @returns {VersionConfig}
 */
function validateVersionConfig(versionConfig) {
  const yearMonth = String(versionConfig.yearMonth ?? '')
  const buildNumber = Number(versionConfig.buildNumber)

  if (!VERSION_MONTH_PATTERN.test(yearMonth)) {
    throw new Error(
      `Invalid yearMonth "${yearMonth}". Expected the format YYYY.MM.`
    )
  }

  if (!Number.isInteger(buildNumber) || buildNumber < 1 || buildNumber > 999) {
    throw new Error(
      `Invalid buildNumber "${versionConfig.buildNumber}". Expected an integer between 1 and 999.`
    )
  }

  return {
    yearMonth,
    buildNumber,
  }
}

/**
 * @param {string} yearMonth
 * @param {number} buildNumber
 * @returns {string}
 */
function formatMarketingVersion(yearMonth, buildNumber) {
  return `${yearMonth}.${String(buildNumber).padStart(3, '0')}`
}

/**
 * @param {string} yearMonth
 * @param {number} buildNumber
 * @returns {string}
 */
function formatPackageVersion(yearMonth, buildNumber) {
  const [yearPart, monthPart] = yearMonth.split('.')
  const year = Number(yearPart)
  const month = Number(monthPart)

  if (!Number.isInteger(year) || !Number.isInteger(month)) {
    throw new Error(`Invalid yearMonth "${yearMonth}"`)
  }

  return `${year}.${month}.${buildNumber}`
}

/**
 * @param {string} yearMonth
 * @param {number} buildNumber
 * @returns {number}
 */
function formatVersionCode(yearMonth, buildNumber) {
  const [yearPart, monthPart] = yearMonth.split('.')
  const year = Number(yearPart)
  const month = Number(monthPart)

  if (!Number.isInteger(year) || !Number.isInteger(month)) {
    throw new Error(`Invalid yearMonth "${yearMonth}"`)
  }

  return year * 100000 + month * 1000 + buildNumber
}

/**
 * @param {VersionConfig} versionConfig
 * @returns {VersionSnapshot}
 */
function getVersionSnapshot(versionConfig) {
  const validated = validateVersionConfig(versionConfig)

  return {
    ...validated,
    marketingVersion: formatMarketingVersion(
      validated.yearMonth,
      validated.buildNumber
    ),
    packageVersion: formatPackageVersion(
      validated.yearMonth,
      validated.buildNumber
    ),
    versionCode: formatVersionCode(validated.yearMonth, validated.buildNumber),
  }
}

module.exports = {
  VERSION_MONTH_PATTERN,
  formatMarketingVersion,
  formatPackageVersion,
  formatVersionCode,
  getVersionSnapshot,
  validateVersionConfig,
}
