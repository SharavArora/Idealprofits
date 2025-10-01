# ideas.py
from fastapi import APIRouter
from typing import List

router = APIRouter()

# Example in-memory idea storage
ideas_db = []

@router.get("/")
def get_ideas():
    return ideas_db

@router.post("/")
def post_idea(creator: str, text: str):
    idea_id = len(ideas_db) + 1
    idea = {"id": idea_id, "creator": creator, "text": text, "upvotes": 0, "entrepreneurs": []}
    ideas_db.append(idea)
    return idea
