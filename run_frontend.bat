@echo off
chcp 65001 >nul
echo Starting Haru no Yorokobi local server...
cd /d "%~dp0"
start http://localhost:8000/frontend/pages/index.html
python -m http.server 8000
pause
