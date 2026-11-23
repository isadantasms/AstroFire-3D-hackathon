:; exec python3 "$(cd "$(dirname "$0")" && pwd)/serve_webgl.py" "$(cd "$(dirname "$0")" && pwd)/index.html" "$@"
rem SI-assisted: generated with Codex, reviewed and edited by Esquivel & Elias (21 PyroRangers).
@echo off
setlocal
python "%~dp0serve_webgl.py" "%~dp0index.html" %*
if errorlevel 1 pause
