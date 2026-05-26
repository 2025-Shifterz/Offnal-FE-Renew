#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

WORKSPACE_PATH="${ROOT_DIR}/ios/Offnal.xcworkspace"
SCHEME="${1:-Development}"
CONFIGURATION="${2:-Debug}"
ENVFILE_PATH="${3:-env/.env.development}"
DEVICE_ID="${DEVICE_ID:-${4:-}}"
DEVICE_NAME="${DEVICE_NAME:-}"
DERIVED_DATA_PATH="${DERIVED_DATA_PATH:-${ROOT_DIR}/ios/build/device}"
METRO_PORT="${RCT_METRO_PORT:-${METRO_PORT:-8081}}"
METRO_COMMAND="${ROOT_DIR}/scripts/start-metro.command"
BUILD_SETTINGS_PATH="${DERIVED_DATA_PATH}/build-settings.txt"

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

read_build_setting() {
  local key="$1"
  awk -F '=' -v setting="${key}" '
    {
      key_name = $1
      value = $2
      sub(/^[[:space:]]+/, "", key_name)
      sub(/[[:space:]]+$/, "", key_name)
      sub(/^[[:space:]]+/, "", value)
      sub(/[[:space:]]+$/, "", value)
      if (key_name == setting) {
        resolved = value
      }
    }
    END { print resolved }
  ' "${BUILD_SETTINGS_PATH}"
}

find_available_device_id() {
  xcrun devicectl list devices | sed -nE '/available \(paired\)/s/.* ([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}) .*/\1/p' | head -n 1
}

is_device_name_available() {
  local name="$1"
  xcrun devicectl list devices | awk -v device_name="${name}" 'index($0, device_name) && /available \(paired\)/ { found = 1 } END { exit found ? 0 : 1 }'
}

if [[ -n "${DEVICE_ID}" ]]; then
  XCODE_DESTINATION="id=${DEVICE_ID}"
  DEVICE_SELECTOR="${DEVICE_ID}"
elif [[ -n "${DEVICE_NAME}" ]]; then
  if ! is_device_name_available "${DEVICE_NAME}"; then
    echo "Physical iOS device named '${DEVICE_NAME}' is not available. Set DEVICE_ID or connect a paired device and try again." >&2
    exit 1
  fi
  XCODE_DESTINATION="generic/platform=iOS"
  DEVICE_SELECTOR="${DEVICE_NAME}"
else
  DEVICE_SELECTOR="$(find_available_device_id)"
  if [[ -z "${DEVICE_SELECTOR}" ]]; then
    echo "No available paired physical iOS device was found. Set DEVICE_ID or DEVICE_NAME and try again." >&2
    exit 1
  fi
  XCODE_DESTINATION="generic/platform=iOS"
fi

start_metro_if_needed

mkdir -p "${DERIVED_DATA_PATH}"

echo "Resolving build settings for ${SCHEME} (${CONFIGURATION})"
ENVFILE="${ENVFILE_PATH}" xcodebuild \
  -workspace "${WORKSPACE_PATH}" \
  -scheme "${SCHEME}" \
  -configuration "${CONFIGURATION}" \
  -destination "${XCODE_DESTINATION}" \
  -derivedDataPath "${DERIVED_DATA_PATH}" \
  -showBuildSettings > "${BUILD_SETTINGS_PATH}"

BUNDLE_ID="${BUNDLE_ID:-$(read_build_setting PRODUCT_BUNDLE_IDENTIFIER)}"
APP_WRAPPER_NAME="$(read_build_setting WRAPPER_NAME)"

if [[ -z "${BUNDLE_ID}" ]]; then
  echo "PRODUCT_BUNDLE_IDENTIFIER was not found in Xcode build settings" >&2
  exit 1
fi

if [[ -z "${APP_WRAPPER_NAME}" ]]; then
  echo "WRAPPER_NAME was not found in Xcode build settings" >&2
  exit 1
fi

echo "Building ${SCHEME} (${CONFIGURATION}) for device ${DEVICE_SELECTOR}"
ENVFILE="${ENVFILE_PATH}" xcodebuild \
  -workspace "${WORKSPACE_PATH}" \
  -scheme "${SCHEME}" \
  -configuration "${CONFIGURATION}" \
  -destination "${XCODE_DESTINATION}" \
  -derivedDataPath "${DERIVED_DATA_PATH}" \
  build

APP_PATH="${DERIVED_DATA_PATH}/Build/Products/${CONFIGURATION}-iphoneos/${APP_WRAPPER_NAME}"

if [[ ! -d "${APP_PATH}" ]]; then
  echo "Built app was not found at ${APP_PATH}" >&2
  exit 1
fi

echo "Installing ${APP_PATH}"
xcrun devicectl device install app --device "${DEVICE_SELECTOR}" "${APP_PATH}"

echo "Launching ${BUNDLE_ID}"
xcrun devicectl device process launch --device "${DEVICE_SELECTOR}" --terminate-existing "${BUNDLE_ID}"
