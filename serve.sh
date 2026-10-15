#!/bin/zsh
# PensionSteps Local Server
# Usage: ./serve.sh [PORT]
cd "$(dirname "$0")"
PORT=${1:-8080}
echo "--------------------------------------------------------"
echo "  PensionSteps - UK Pensions Administration Prototype   "
echo "--------------------------------------------------------"
echo "Running locally at: http://localhost:$PORT"
echo "Press Ctrl+C to stop the server."
echo ""
open "http://localhost:$PORT" 2>/dev/null || true
python3 -m http.server "$PORT"
