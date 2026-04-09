#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const {
  getVersionSnapshot,
  validateVersionConfig,
  formatMarketingVersion,
  formatPackageVersion,
  formatVersionCode,
} = require('../src/shared/config/versionUtils')

const VERSION_FILE_PATH = path.join(__dirname, '..', 'version.json')
const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json')
const PACKAGE_LOCK_PATH = path.join(__dirname, '..', 'package-lock.json')

function getKstYearMonth(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
  })

  const parts = formatter.formatToParts(date)
  const year = parts.find(part => part.type === 'year')?.value
  const month = parts.find(part => part.type === 'month')?.value

  if (!year || !month) {
    throw new Error('Failed to resolve the current KST year.month value.')
  }

  return `${year}.${month}`
}

function readVersionConfig(filePath = VERSION_FILE_PATH) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing version config: ${filePath}`)
  }

  const parsed = readJsonFile(filePath)
  return validateVersionConfig(parsed)
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJsonFile(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

function writeVersionConfig(filePath, versionConfig) {
  writeJsonFile(filePath, versionConfig)
}

function syncPackageJsonVersion(snapshot, filePath = PACKAGE_JSON_PATH) {
  const packageJson = readJsonFile(filePath)
  packageJson.version = snapshot.packageVersion
  writeJsonFile(filePath, packageJson)
  return packageJson.version
}

function syncPackageLockVersion(snapshot, filePath = PACKAGE_LOCK_PATH) {
  if (!fs.existsSync(filePath)) {
    return null
  }

  const packageLock = readJsonFile(filePath)
  packageLock.version = snapshot.packageVersion

  if (packageLock.packages?.['']) {
    packageLock.packages[''].version = snapshot.packageVersion
  }

  writeJsonFile(filePath, packageLock)
  return packageLock.version
}

function syncVersionYearMonth(filePath = VERSION_FILE_PATH) {
  const versionConfig = readVersionConfig(filePath)
  const nextVersionConfig = {
    ...versionConfig,
    yearMonth: getKstYearMonth(),
  }

  writeVersionConfig(filePath, nextVersionConfig)
  const snapshot = getVersionSnapshot(nextVersionConfig)
  syncPackageJsonVersion(snapshot)
  syncPackageLockVersion(snapshot)
  return snapshot
}

function checkVersionConfig(filePath = VERSION_FILE_PATH) {
  const current = readVersionConfig(filePath)
  const snapshot = getVersionSnapshot(current)
  const currentYearMonth = getKstYearMonth()

  if (snapshot.yearMonth !== currentYearMonth) {
    throw new Error(
      `version.json yearMonth must match the current KST month. Expected ${currentYearMonth}, received ${snapshot.yearMonth}.`
    )
  }

  const packageJson = readJsonFile(PACKAGE_JSON_PATH)

  if (packageJson.version !== snapshot.packageVersion) {
    throw new Error(
      `package.json version must match the derived semver. Expected ${snapshot.packageVersion}, received ${packageJson.version}.`
    )
  }

  if (fs.existsSync(PACKAGE_LOCK_PATH)) {
    const packageLock = readJsonFile(PACKAGE_LOCK_PATH)
    const packageLockVersion = packageLock.packages?.['']?.version

    if (
      packageLock.version !== snapshot.packageVersion ||
      packageLockVersion !== snapshot.packageVersion
    ) {
      throw new Error(
        `package-lock.json version must match the derived semver. Expected ${snapshot.packageVersion}, received ${packageLock.version} / ${packageLockVersion}.`
      )
    }
  }

  return snapshot
}

function printUsage() {
  console.error(
    [
      'Usage:',
      '  node scripts/version.js sync',
      '  node scripts/version.js check',
      '  node scripts/version.js json',
      '  node scripts/version.js xcconfig',
    ].join('\n')
  )
}

if (require.main === module) {
  const command = process.argv[2]

  try {
    if (command === 'sync') {
      const snapshot = syncVersionYearMonth()
      console.log(
        `Updated version files to ${snapshot.marketingVersion} (${snapshot.versionCode}), package ${snapshot.packageVersion}`
      )
    } else if (command === 'check') {
      const snapshot = checkVersionConfig()
      console.log(
        `Version config is current: ${snapshot.marketingVersion} (${snapshot.versionCode}), package ${snapshot.packageVersion}`
      )
    } else if (command === 'json') {
      const snapshot = getVersionSnapshot(readVersionConfig())
      console.log(JSON.stringify(snapshot, null, 2))
    } else if (command === 'xcconfig') {
      const snapshot = getVersionSnapshot(readVersionConfig())
      console.log(`OFFNAL_MARKETING_VERSION = ${snapshot.marketingVersion}`)
      console.log(`OFFNAL_VERSION_CODE = ${snapshot.versionCode}`)
    } else {
      printUsage()
      process.exitCode = 1
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}

module.exports = {
  checkVersionConfig,
  formatMarketingVersion,
  formatVersionCode,
  getKstYearMonth,
  getVersionSnapshot,
  formatPackageVersion,
  readVersionConfig,
  syncVersionYearMonth,
  validateVersionConfig,
  VERSION_FILE_PATH,
}
