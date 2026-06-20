Write-Host "===================================================" -ForegroundColor DarkCyan
Write-Host "    STARTING MEDIAHUB DOWNLOADER APPLICATION" -ForegroundColor Magenta
Write-Host "===================================================" -ForegroundColor DarkCyan
Write-Host ""

# 1. Launch Backend API in a separate CMD shell
Write-Host "Launching Flask Backend API..."
Start-Process cmd.exe -ArgumentList "/k", "cd mediahub\backend && if not exist venv (echo Creating Virtual Env... && python -m venv venv && call venv\Scripts\activate.bat && echo Installing requirements... && pip install -r requirements.txt) else (call venv\Scripts\activate.bat) && echo Starting Flask Server... && python app.py"

# 2. Launch Frontend UI in a separate CMD shell
Write-Host "Launching React Frontend UI..."
Start-Process cmd.exe -ArgumentList "/k", "cd mediahub\frontend && if not exist node_modules (echo Installing Node modules... && npm install) && echo Starting Vite Server... && npm run dev"

Write-Host ""
Write-Host "===================================================" -ForegroundColor Green
Write-Host "   LAUNCH SUCCESSFUL!" -ForegroundColor Green
Write-Host "   Backend API: http://localhost:5093" -ForegroundColor Green
Write-Host "   Frontend UI: http://localhost:5173" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""
