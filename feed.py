from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Idea
from typing import List
import datetime

router = APIRouter()

def trending_score(idea: Idea):
    # Algorithm = upvotes + 2*number_of_commissions + recency_score
    recency = (datetime.datetime.utcnow() - idea.last_activity).total_seconds()
    return idea.upvotes * 1 + len(idea.entrepreneurs.split(",")) * 2 - recency/86400  # normalized

@router.get("/feed")
def get_feed(db: Session = Depends(get_db), limit: int = 20):
    ideas = db.query(Idea).all()
    ideas_sorted = sorted(ideas, key=lambda x: trending_score(x), reverse=True)
    return [{
        "id": i.id,
        "creator_id": i.creator_id,
        "text": i.text,
        "upvotes": i.upvotes,
        "entrepreneurs": i.entrepreneurs.split(",") if i.entrepreneurs else [],
        "created_at": i.created_at
    } for i in ideas_sorted[:limit]]
