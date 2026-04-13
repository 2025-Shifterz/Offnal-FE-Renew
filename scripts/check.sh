#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Step 1. Verify forbidden file changes"
bash ./scripts/verify-no-secrets.sh

echo "==> Step 2. Run lint"
npm run lint

echo "==> Step 3. Run full test suite"
npm test -- --passWithNoTests

echo "✅ Full repository checks completed"