#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-}"

case "$MODE" in
  development)
    ENVFILE="env/.env.development"
    ;;
  production)
    ENVFILE="env/.env.production"
    ;;
  *)
    echo "Usage: scripts/prepare-ios-env-xcconfig.sh <development|production>" >&2
    exit 2
    ;;
esac

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IOS_DIR="$ROOT_DIR/ios"
ENV_PATH="$ROOT_DIR/$ENVFILE"
TMP_XCCONFIG="$IOS_DIR/tmp.xcconfig"

if [ ! -f "$ENV_PATH" ]; then
  echo "Missing required env file for $MODE build: $ENVFILE" >&2
  exit 1
fi

printf '%s\n' "$ENVFILE" > /tmp/envfile
export ENVFILE

"$ROOT_DIR/node_modules/react-native-config/ios/ReactNativeConfig/BuildXCConfig.rb" "$ROOT_DIR" "$TMP_XCCONFIG"
node "$ROOT_DIR/scripts/version.js" xcconfig >> "$TMP_XCCONFIG"

echo "Prepared iOS xcconfig for $MODE build"
