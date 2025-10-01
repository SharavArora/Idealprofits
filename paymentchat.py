from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Commission
from schemas import CommissionBase, CommissionResponse
from typing import List

router = APIRouter()

# Request commission inside a chat
@router.post("/chat/{chat_id}/commission", response_model=CommissionResponse)
def request_commission(chat_id: int, commission: CommissionBase, db: Session = Depends(get_db)):
    new_commission = Commission(
        chat_id=chat_id,
        amount=commission.amount,
        status="pending"
    )
    db.add(new_commission)
    db.commit()
    db.refresh(new_commission)
    return new_commission

# List commissions for a chat
@router.get("/chat/{chat_id}/commissions", response_model=List[CommissionResponse])
def list_commissions(chat_id: int, db: Session = Depends(get_db)):
    commissions = db.query(Commission).filter(Commission.chat_id == chat_id).all()
    return commissions