#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

get_changed_source_files() {
  {
    git diff --name-only
    git diff --cached --name-only
    git ls-files --others --exclude-standard
  } | sed '/^$/d' | sort -u | grep -E '\.(ts|tsx|js|jsx)$' || true
}

CHANGED_SOURCE_FILES="$(get_changed_source_files)"

if [ -z "$CHANGED_SOURCE_FILES" ]; then
  echo "==> No changed .ts/.tsx/.js/.jsx files found"
  echo "✅ Skipping related tests"
  exit 0
fi

echo "==> Running Jest related tests for changed files"
echo "$CHANGED_SOURCE_FILES"

JEST_INPUTS=()
while IFS= read -r file; do
  [ -z "$file" ] && continue
  JEST_INPUTS+=("$file")
done <<< "$CHANGED_SOURCE_FILES"

if [ "${#JEST_INPUTS[@]}" -eq 0 ]; then
  echo "✅ No valid source inputs found for related tests"
  exit 0
fi

npx jest --findRelatedTests --passWithNoTests "${JEST_INPUTS[@]}"

echo "✅ Related tests completed"
