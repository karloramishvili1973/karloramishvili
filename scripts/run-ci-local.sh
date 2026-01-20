#!/usr/bin/env bash
set -euo pipefail
echo "Running local CI steps (bash)"

if command -v pnpm >/dev/null 2>&1; then
  echo "Using pnpm to install workspace dependencies..."
  pnpm -w install --frozen-lockfile
else
  echo "pnpm not found; using npm to install workspace dependencies..."
  npm install
fi

echo "Running contracts tests..."
pushd packages/contracts
if [ ! -d node_modules ]; then
  if command -v pnpm >/dev/null 2>&1; then
    pnpm install --frozen-lockfile || true
  else
    npm install || true
  fi
fi

npm run compile
npm test 2>&1 | tee test-output.txt
echo "Tests finished. Output saved to packages/contracts/test-output.txt"
popd
