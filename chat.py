from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Chat, Message
from schemas import ChatBase, ChatResponse, MessageBase, MessageResponse
from typing import List
import datetime

router = APIRouter()

# Start a new chat
@router.post("/chat/start", response_model=ChatResponse)
def start_chat(chat: ChatBase, db: Session = Depends(get_db)):
    new_chat = Chat(
        idea_id=chat.idea_id,
        user1_id=chat.user1_id,
        user2_id=chat.user2_id,
        created_at=datetime.datetime.utcnow()
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat

# Send message
@router.post("/chat/message", response_model=MessageResponse)
def send_message(msg: MessageBase, db: Session = Depends(get_db)):
    message = Message(
        chat_id=msg.chat_id,
        sender_id=msg.sender_id,
        content=msg.content,
        timestamp=datetime.datetime.utcnow()
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

# Get messages for a chat
@router.get("/chat/{chat_id}/messages", response_model=List[MessageResponse])
def get_messages(chat_id: int, db: Session = Depends(get_db)):
    msgs = db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.timestamp).all()
    return msgs
