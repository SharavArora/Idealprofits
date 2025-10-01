from fastapi import FastAPI
from auth import router as auth_router
from ideas import router as ideas_router

app = FastAPI()

# Include routers
app.include_router(auth_router, prefix="/auth")
app.include_router(ideas_router, prefix="/ideas")

@app.get("/")
def root():
    return {"message": "Idealprofits backend running!"}
