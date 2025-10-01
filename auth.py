from fastapi import APIRouter, HTTPException, Depends
from passlib.hash import bcrypt
import jwt, datetime
from sqlalchemy.orm import Session
from database import get_db
from models import User

router = APIRouter()

SECRET_KEY = "AIzaSyDzkjNcsSc0qRsDJX68gr-sTTu8pYea0uw"

@router.post("/signup")
def signup(payload: dict, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload["email"]).first():
        raise HTTPException(400, "User exists")
    hashed = bcrypt.hash(payload["password"])
    user = User(name=payload["name"], email=payload["email"], password_hash=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    token = jwt.encode({"user_id": user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)}, SECRET_KEY)
    return {"token": token, "userId": user.id}

@router.post("/login")
def login(payload: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload["email"]).first()
    if not user or not bcrypt.verify(payload["password"], user.password_hash):
        raise HTTPException(400, "Invalid credentials")
    token = jwt.encode({"user_id": user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)}, SECRET_KEY)
    return {"token": token, "userId": user.id}
