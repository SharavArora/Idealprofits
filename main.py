from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI is working!"}  
import os
from fastapi import FastAPI
from auth import router as auth_router

app = FastAPI()
app.include_router(auth_router, prefix="/auth")

@app.get("/")
def root():
    return {"message": "Backend is live"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=True)
from fastapi import FastAPI
from auth import router as auth_router  # now works correctly
from database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(auth_router, prefix="/auth")

@app.get("/")
def root():
    return {"message": "Backend is live"}
