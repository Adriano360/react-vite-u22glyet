@echo off
cd /d "%~dp0"
echo Preparando o site...
call npm.cmd run build
if errorlevel 1 (
  echo.
  echo Nao foi possivel preparar o site.
  pause
  exit /b 1
)
start "" "%~dp0dist\index.html"
