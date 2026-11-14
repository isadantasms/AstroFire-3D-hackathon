:; exec python3 "$(cd "$(dirname "$0")" && pwd)/serve_webgl.py" "$(cd "$(dirname "$0")" && pwd)/index.html" "$@"
@echo off
setlocal
python "%~dp0serve_webgl.py" "%~dp0index.html" %*
if errorlevel 1 pause
