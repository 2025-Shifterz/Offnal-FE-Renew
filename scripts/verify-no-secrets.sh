#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

get_changed_files() {
  {
    git diff --name-only
    git diff --cached --name-only
    git ls-files --others --exclude-standard
    git ls-files --others -i --exclude-standard
  } | sed '/^$/d' | sort -u
}

CHANGED_FILES="$(get_changed_files || true)"

if [ -z "$CHANGED_FILES" ]; then
  echo "==> No changed files found for secret check"
  exit 0
fi

is_forbidden_file() {
  local file="$1"

  case "$file" in
    .env|.env.*|env/*)
      return 0
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

echo "✅ No forbidden secret/environment file changes detected"
