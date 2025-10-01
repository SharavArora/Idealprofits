# 1️⃣ Create folder if not exists
$backendPath = "IdealprofitsBackend"
if (-not (Test-Path $backendPath)) {
    mkdir $backendPath
}

# 2️⃣ Change directory
Set-Location $backendPath

# 3️⃣ Create virtual environment
python -m venv venv

# 4️⃣ Activate virtual environment
& .\venv\Scripts\Activate.ps1

# 5️⃣ Install dependencies
pip install --upgrade pip
pip install fastapi uvicorn gunicorn sqlalchemy pydantic psycopg2-binary python-dotenv python-jose passlib bcrypt python-multipart redis celery python-socketio

# 6️⃣ Create main.py
@"
import os
from fastapi import FastAPI

app = FastAPI()

@app.get('/')
def root():
    return {'message': 'Backend is live'}

if __name__ == '__main__':
    import uvicorn
    port = int(os.environ.get('PORT', 8000))
    uvicorn.run(app, host='0.0.0.0', port=port, reload=True)
"@ | Out-File -FilePath main.py -Encoding UTF8

# 7️⃣ Create Procfile (fixed $PORT)
@"
web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:`$PORT
"@ | Set-Content -Encoding UTF8 Procfile

# 8️⃣ Run backend locally
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
