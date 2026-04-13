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

if [ -z "$CHANGED_FILES" ]; then
  echo "==> No changed files found"
  exit 0
fi

echo "==> Changed files"
echo "$CHANGED_FILES"
echo

echo "==> Step 1. Verify forbidden file changes"
bash ./scripts/verify-no-secrets.sh

echo "==> Step 2. Run lint"
npm run lint

needs_full_test=false
needs_related_test=false
has_app_code_change=false

while IFS= read -r file; do
  [ -z "$file" ] && continue

  case "$file" in
    src/store/*|src/data/*|src/infrastructure/*|src/navigation/*|src/shared/*|__tests__/*)
      needs_full_test=true
      has_app_code_change=true
      ;;
    src/presentation/*)
      needs_related_test=true
      has_app_code_change=true
      ;;
    *.ts|*.tsx|*.js|*.jsx)
      has_app_code_change=true
      ;;
  esac
done <<< "$CHANGED_FILES"

if [ "$needs_full_test" = true ]; then
  echo "==> Step 3. Core or cross-cutting code changed -> run full test suite"
  npm test -- --passWithNoTests
elif [ "$needs_related_test" = true ]; then
  echo "==> Step 3. Presentation code changed -> run related tests"
  bash ./scripts/test-related.sh
elif [ "$has_app_code_change" = true ]; then
  echo "==> Step 3. App code changed outside mapped folders -> run related tests as safe default"
  bash ./scripts/test-related.sh
else
  echo "==> Step 3. No app code changes detected -> skip tests"
fi

echo "✅ Changed-file checks completed"
