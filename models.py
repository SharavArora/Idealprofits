from sqlalchemy import Column, Integer, String, ForeignKey, Text, Float, DateTime
from database import Base
import datetime

class Chat(Base):
    __tablename__ = "chats"
    id = Column(Integer, primary_key=True)
    idea_id = Column(Integer, ForeignKey("ideas.id"))
    user1_id = Column(Integer, ForeignKey("users.id"))  # idea owner
    user2_id = Column(Integer, ForeignKey("users.id"))  # entrepreneur/dev
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Commission(Base):
    __tablename__ = "commissions"
    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    amount = Column(Float)
    status = Column(String, default="pending")  # pending, paid
class Idea(Base):
    __tablename__ = "ideas"
    id = Column(Integer, primary_key=True)
    creator_id = Column(Integer, ForeignKey("users.id"))
    text = Column(String)
    upvotes = Column(Integer, default=0)
    entrepreneurs = Column(String)  # comma-separated list of entrepreneur IDs
    created_at = Column(DateTime, default=datetime.datetime.utcnow())
    last_activity = Column(DateTime, default=datetime.datetime.utcnow())  # for trending
