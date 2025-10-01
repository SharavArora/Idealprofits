from pydantic import BaseModel
from typing import List, Optional

class IdeaBase(BaseModel):
    text: str

class IdeaCreate(IdeaBase):
    creator_id: int
    creator: Optional[str] = "Anonymous"

class IdeaResponse(IdeaBase):
    id: int
    creator: str
    upvotes: int
    entrepreneurs: List[str] = []

    class Config:
        orm_mode = True
