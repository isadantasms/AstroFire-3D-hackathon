#!/usr/bin/env bash
# SI-assisted: generated with Gemini, reviewed by Elias — AstroFire 3D
set -e

export PATH="/home/leandroelias/.local/node/bin:$PATH"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting AstroFire 3D Backend API on http://localhost:8000 ..."
PYTHONPATH="$ROOT_DIR" python3 -m backend.app.main &
BACKEND_PID=$!

echo "Starting AstroFire 3D Unity WebGL 3D Simulator via StartWebGL.cmd on http://127.0.0.1:8080/index.html ..."
bash "$ROOT_DIR/unity-fire-simulation/WebGlSimulation/StartWebGL.cmd" --port 8080 --no-browser &
WEBGL_PID=$!

echo "Starting AstroFire 3D Frontend Console on http://localhost:5173 ..."
cd "$ROOT_DIR/frontend"
VITE_API_MODE=live VITE_API_BASE_URL=http://localhost:8000 VITE_WEBGL_URL=http://127.0.0.1:8080/index.html npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $WEBGL_PID $FRONTEND_PID 2>/dev/null || true" EXIT
wait
