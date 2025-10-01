# ---------------------------------------
# Idealprofits One-Command Deploy Script
# ---------------------------------------

# 1️⃣ Navigate to backend folder
Set-Location "$PSScriptRoot\backend"

# 2️⃣ Create virtual environment if not exists
if (-Not (Test-Path ".\venv")) {
    python -m venv venv
    Write-Host "✅ Virtual environment created"
} else {
    Write-Host "⚡ Virtual environment already exists"
}

# 3️⃣ Activate virtual environment
$venvActivate = ".\venv\Scripts\Activate.ps1"
if (Test-Path $venvActivate) {
    & $venvActivate
    Write-Host "✅ Virtual environment activated"
} else {
    Write-Warning "⚠️ Activate script not found, make sure venv exists"
}

# 4️⃣ Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
Write-Host "✅ Backend dependencies installed"

# 5️⃣ Create database tables
python -c "from database import Base, engine; from models import User; Base.metadata.create_all(bind=engine); print('✅ Tables created')"

# 6️⃣ Navigate to frontend folder
Set-Location "$PSScriptRoot\frontend"

# 7️⃣ Install frontend dependencies
npm install
Write-Host "✅ Frontend dependencies installed"

# 8️⃣ Build frontend
npm run build
Write-Host "✅ Frontend build complete"

# 9️⃣ Optional: Push to GitHub
Set-Location "$PSScriptRoot"
git add .
git commit -m 'Deploy backend + frontend'
git push origin main
Write-Host "✅ Code pushed to GitHub"

#  🔹 Backend run instructions
Write-Host "`n🚀 To run backend locally, go to backend folder and execute:"
Write-Host "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
Write-Host "Frontend is ready in frontend/build folder"
