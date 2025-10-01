from sqlalchemy.orm import Session
from models import Idea, Commission
from schemas import IdeaCreate
from typing import List

def get_ideas(db: Session) -> List[Idea]:
    return db.query(Idea).all()

def get_top_ideas(db: Session) -> List[Idea]:
    return db.query(Idea).order_by(Idea.upvotes.desc()).all()

def create_idea(db: Session, idea: IdeaCreate) -> Idea:
    db_idea = Idea(creator_id=idea.creator_id, creator=idea.creator, text=idea.text)
    db.add(db_idea)
    db.commit()
    db.refresh(db_idea)
    return db_idea

def upvote_idea(db: Session, idea_id: int) -> Idea:
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if idea:
        idea.upvotes += 1
        db.commit()
        db.refresh(idea)
    return idea

def agree_commission(db: Session, idea_id: int, entrepreneur_id: int, entrepreneur_name: str) -> List[str]:
    # Check if already agreed
    existing = db.query(Commission).filter(
        Commission.idea_id == idea_id,
        Commission.entrepreneur_id == entrepreneur_id
    ).first()
    if not existing:
        commission = Commission(idea_id=idea_id, entrepreneur_id=entrepreneur_id, entrepreneur_name=entrepreneur_name)
        db.add(commission)
        db.commit()
    entrepreneurs = [c.entrepreneur_name for c in db.query(Commission).filter(Commission.idea_id == idea_id).all()]
    return entrepreneurs
