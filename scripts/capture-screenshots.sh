#!/usr/bin/env bash
# scripts/capture-screenshots.sh
# Usage: ./scripts/capture-screenshots.sh [PORT] [TASK_NAME]
# Example: ./scripts/capture-screenshots.sh 3000 task-02

set -euo pipefail

PORT="${1:-3000}"
TASK="${2:-all}"
BASE_URL="http://localhost:${PORT}"
OUT_DIR="${PWD}/.scratch/screenshots/${TASK}"

mkdir -p "${OUT_DIR}"

capture() {
  local route="$1"
  local name="$2"
  local width="$3"
  local height="$4"
  local url="${BASE_URL}${route}"
  local outfile="${OUT_DIR}/${name}_${width}x${height}.png"

  local tmp_profile
  tmp_profile=$(mktemp -d)
  
  echo "Capturing ${url} at ${width}x${height} -> ${outfile}..."
  firefox --headless --no-remote --profile "${tmp_profile}" --screenshot "${outfile}" --window-size "${width},${height}" "${url}" >/dev/null 2>&1 || true
  rm -rf "${tmp_profile}"
}

# Viewports required by R2:
# Mobile: 375px (iPhone SE/Mini), 390px (iPhone 12/13/14)
# Desktop: 1280px (Standard Desktop)
VIEWPORTS=("375:812" "390:844" "1280:900")

capture_route() {
  local route="$1"
  local slug="$2"
  for vp in "${VIEWPORTS[@]}"; do
    IFS=":" read -r w h <<< "$vp"
    capture "${route}" "${slug}" "$w" "$h"
  done
}

case "$TASK" in
  task-02|02)
    capture_route "/shop" "shop_catalog"
    capture_route "/shop/traditional-bronze-kalash" "shop_detail"
    ;;
  task-03|03)
    capture_route "/custom-work" "portfolio_gallery"
    capture_route "/custom-work/nataraja-ananda-tandava-murti" "portfolio_detail"
    capture_route "/custom-work/inquire" "commission_inquire"
    ;;
  task-04|04)
    capture_route "/admin" "admin_dashboard"
    capture_route "/admin/products" "admin_products"
    capture_route "/admin/portfolio" "admin_portfolio"
    ;;
  *)
    capture_route "/" "landing"
    capture_route "/shop" "shop_catalog"
    capture_route "/shop/traditional-bronze-kalash" "shop_detail"
    capture_route "/custom-work" "portfolio_gallery"
    capture_route "/custom-work/nataraja-ananda-tandava-murti" "portfolio_detail"
    capture_route "/custom-work/inquire" "commission_inquire"
    capture_route "/admin" "admin_dashboard"
    capture_route "/admin/products" "admin_products"
    capture_route "/admin/portfolio" "admin_portfolio"
    ;;
esac

echo "Screenshots captured in ${OUT_DIR}:"
ls -la "${OUT_DIR}"
