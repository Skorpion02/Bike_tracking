@echo off
echo Iniciando servidor...
cd /d "%~dp0"
start cmd /c "npm start"
timeout /t 2 /nobreak >nul
echo Abriendo navegador...
start "" "frontend\home.html"
echo Listo! El servidor esta corriendo y el navegador se abrio.
pause
