#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:?Usage: ./qa-playwright-capture.sh http://localhost:8000 public/qa-screenshots}"
OUTPUT_DIR="${2:?Usage: ./qa-playwright-capture.sh http://localhost:8000 public/qa-screenshots}"
mkdir -p "$OUTPUT_DIR"

for route in / /profil /berita /spmb; do
  name="${route#/}"
  name="${name:-home}"
  npx --yes playwright screenshot --viewport-size="1440,900" "${BASE_URL%/}${route}" "$OUTPUT_DIR/${name}-desktop.png"
  npx --yes playwright screenshot --viewport-size="360,800" "${BASE_URL%/}${route}" "$OUTPUT_DIR/${name}-mobile.png"
done
