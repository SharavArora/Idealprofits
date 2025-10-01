from fastapi import FastAPI, Depends, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models, crud, schemas
from typing import List

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow frontend localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# In-memory WebSocket manager
clients: List[WebSocket] = []

@app.websocket("/ws/ideas")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keep connection alive
    except:
        clients.remove(websocket)

async def broadcast_idea(idea):
    for client in clients:
        await client.send_json(idea)

@app.get("/ideas", response_model=List[schemas.IdeaResponse])
def read_ideas(db: Session = Depends(get_db)):
    ideas = crud.get_ideas(db)
    result = []
    for idea in ideas:
        entrepreneurs = [c.entrepreneur_name for c in db.query(models.Commission).filter(models.Commission.idea_id == idea.id).all()]
        result.append(schemas.IdeaResponse(id=idea.id, creator=idea.creator, text=idea.text, upvotes=idea.upvotes, entrepreneurs=entrepreneurs))
    return result

@app.get("/ideas/top", response_model=List[schemas.IdeaResponse])
def read_top_ideas(db: Session = Depends(get_db)):
    ideas = crud.get_top_ideas(db)
    result = []
    for idea in ideas:
        entrepreneurs = [c.entrepreneur_name for c in db.query(models.Commission).filter(models.Commission.idea_id == idea.id).all()]
        result.append(schemas.IdeaResponse(id=idea.id, creator=idea.creator, text=idea.text, upvotes=idea.upvotes, entrepreneurs=entrepreneurs))
    return result

@app.post("/ideas", response_model=schemas.IdeaResponse)
def create_idea(idea: schemas.IdeaCreate, db: Session = Depends(get_db)):
    db_idea = crud.create_idea(db, idea)
    return schemas.IdeaResponse(id=db_idea.id, creator=db_idea.creator, text=db_idea.text, upvotes=db_idea.upvotes, entrepreneurs=[])

@app.post("/ideas/{idea_id}/upvote")
async def upvote_idea(idea_id: int, db: Session = Depends(get_db)):
    idea = crud.upvote_idea(db, idea_id)
    # Broadcast to WS
    if idea:
        from fastapi.encoders import jsonable_encoder
        import asyncio
        await broadcast_idea(jsonable_encoder({
            "id": idea.id,
            "creator": idea.creator,
            "text": idea.text,
            "upvotes": idea.upvotes,
            "entrepreneurs": [c.entrepreneur_name for c in db.query(models.Commission).filter(models.Commission.idea_id == idea.id).all()]
        }))
    return {"status": "ok"}

@app.post("/ideas/{idea_id}/agree")
async def agree_commission(idea_id: int, payload: dict, db: Session = Depends(get_db)):
    entrepreneur_id = payload.get("entrepreneur_id")
    entrepreneur_name = payload.get("entrepreneur_name", f"Entrepreneur {entrepreneur_id}")
    entrepreneurs = crud.agree_commission(db, idea_id, entrepreneur_id, entrepreneur_name)
    # Broadcast to WS
    from fastapi.encoders import jsonable_encoder
    import asyncio
    await broadcast_idea(jsonable_encoder({
        "id": idea_id,
        "creator": db.query(models.Idea).filter(models.Idea.id == idea_id).first().creator,
        "text": db.query(models.Idea).filter(models.Idea.id == idea_id).first().text,
        "upvotes": db.query(models.Idea).filter(models.Idea.id == idea_id).first().upvotes,
        "entrepreneurs": entrepreneurs
    }))
    return {"entrepreneurs": entrepreneurs}
