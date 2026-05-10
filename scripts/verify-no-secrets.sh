#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

get_changed_files() {
  {
    git diff --name-only
    git diff --cached --name-only
    git ls-files --others --exclude-standard
  } | sed '/^$/d' | sort -u
}

CHANGED_FILES="$(get_changed_files || true)"

is_forbidden_file() {
  local file="$1"

  case "$file" in
    .env|.env.*|env/*|ios/tmp.xcconfig|android/gradle.properties)
      return 0
      ;;
    *.keystore)
      if [ "$file" != "android/app/debug.keystore" ]; then
        return 0
      fi
      return 1
      ;;
    *)
      return 1
      ;;
  esac
}

FORBIDDEN_FILES=()

while IFS= read -r file; do
  [ -z "$file" ] && continue
  if is_forbidden_file "$file"; then
    FORBIDDEN_FILES+=("$file")
  fi
done <<< "$CHANGED_FILES"

if [ "${#FORBIDDEN_FILES[@]}" -gt 0 ]; then
  echo "❌ Forbidden file changes detected:"
  for file in "${FORBIDDEN_FILES[@]}"; do
    echo " - $file"
  done
  echo
  echo "Do not modify .env, env/, or ignored secret/environment files."
  exit 1
fi

TRACKED_SECRET_FILES=()

while IFS= read -r file; do
  [ -z "$file" ] && continue
  if is_forbidden_file "$file"; then
    TRACKED_SECRET_FILES+=("$file")
  fi
done < <(git ls-files)

if [ "${#TRACKED_SECRET_FILES[@]}" -gt 0 ]; then
  echo "❌ Forbidden secret/environment files are tracked:"
  for file in "${TRACKED_SECRET_FILES[@]}"; do
    echo " - $file"
  done
  echo
  echo "Remove these files from git tracking without printing their contents."
  exit 1
fi

echo "✅ No forbidden secret/environment file changes detected"
