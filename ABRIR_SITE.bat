@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao foi encontrado. Instale o Node.js 20.19 ou superior.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalando dependencias...
  call npm.cmd ci
  if errorlevel 1 (
    echo.
    echo Nao foi possivel instalar as dependencias.
    pause
    exit /b 1
  )
)

start "Light+ - Servidor" cmd /k "npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort"

echo Abrindo o site...
for /l %%i in (1,1,30) do (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "try { (Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:5173/').StatusCode -eq 200 } catch { $false }" | findstr /i "True" >nul
  if not errorlevel 1 goto abrir
  timeout /t 1 /nobreak >nul
)

echo.
echo Nao foi possivel abrir o site em http://127.0.0.1:5173/
echo Verifique a janela do servidor para ver a mensagem de erro.
pause
exit /b 1

:abrir
start "" "http://127.0.0.1:5173/"
