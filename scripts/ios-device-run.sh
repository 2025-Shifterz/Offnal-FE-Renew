#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE_PATH="${ROOT_DIR}/ios/Offnal.xcworkspace"
SCHEME="${1:-Development}"
CONFIGURATION="${2:-Debug}"
ENVFILE_PATH="${3:-env/.env.development}"
DEVICE_ID="${DEVICE_ID:-${4:-}}"
DEVICE_NAME="${DEVICE_NAME:-iPhone}"
BUNDLE_ID="${BUNDLE_ID:-com.shifterz.offnal}"
DERIVED_DATA_PATH="${DERIVED_DATA_PATH:-${TMPDIR:-/tmp}/offnal-ios-device-build}"
METRO_PORT="${RCT_METRO_PORT:-${METRO_PORT:-8081}}"
METRO_COMMAND="${ROOT_DIR}/scripts/start-metro.command"

is_metro_running() {
  lsof -nP -iTCP:"${METRO_PORT}" -sTCP:LISTEN >/dev/null 2>&1
}

start_metro_if_needed() {
  if is_metro_running; then
    echo "Metro is already running on port ${METRO_PORT}"
    return
  fi

  echo "Starting Metro in a new Terminal window"
  chmod +x "${METRO_COMMAND}" 2>/dev/null || true
  open -a Terminal "${METRO_COMMAND}"

  for _ in {1..30}; do
    if is_metro_running; then
      echo "Metro is ready on port ${METRO_PORT}"
      return
    fi
    sleep 1
  done

  echo "Metro did not report ready on port ${METRO_PORT}; continuing with the device build" >&2
}

if [[ -n "${DEVICE_ID}" ]]; then
  XCODE_DESTINATION="id=${DEVICE_ID}"
  DEVICE_SELECTOR="${DEVICE_ID}"
else
  XCODE_DESTINATION="generic/platform=iOS"
  DEVICE_SELECTOR="${DEVICE_NAME}"
fi

start_metro_if_needed

echo "Building ${SCHEME} (${CONFIGURATION}) for device ${DEVICE_SELECTOR}"
ENVFILE="${ENVFILE_PATH}" xcodebuild \
  -workspace "${WORKSPACE_PATH}" \
  -scheme "${SCHEME}" \
  -configuration "${CONFIGURATION}" \
  -destination "${XCODE_DESTINATION}" \
  -derivedDataPath "${DERIVED_DATA_PATH}" \
  build

APP_PATH="${DERIVED_DATA_PATH}/Build/Products/${CONFIGURATION}-iphoneos/Offnal.app"

if [[ ! -d "${APP_PATH}" ]]; then
  echo "Built app was not found at ${APP_PATH}" >&2
  exit 1
fi

echo "Installing ${APP_PATH}"
xcrun devicectl device install app --device "${DEVICE_SELECTOR}" "${APP_PATH}"

echo "Launching ${BUNDLE_ID}"
xcrun devicectl device process launch --device "${DEVICE_SELECTOR}" --terminate-existing "${BUNDLE_ID}"
