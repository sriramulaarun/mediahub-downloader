@echo off
echo ===================================================
echo     STARTING MEDIAHUB DOWNLOADER APPLICATION
echo ===================================================
echo.

:: 1. Launch Backend API in a separate window
echo Launching Flask Backend API...
start "MediaHub Backend" cmd /k "cd mediahub\backend && if not exist venv (echo Creating Virtual Environment... && python -m venv venv && call venv\Scripts\activate.bat && echo Installing Python Requirements... && pip install -r requirements.txt) else (call venv\Scripts\activate.bat) && echo Starting Flask Server... && python app.py"

:: 2. Launch Frontend UI in a separate window
echo Launching React Frontend UI...
start "MediaHub Frontend" cmd /k "cd mediahub\frontend && if not exist node_modules (echo Installing Node Modules... && npm install) && echo Starting Vite Dev Server... && npm run dev"

echo.
echo ===================================================
echo    LAUNCH SUCCESSFUL!
echo    Backend API: http://localhost:5093
echo    Frontend UI: http://localhost:5173
echo ===================================================
echo.
pause
