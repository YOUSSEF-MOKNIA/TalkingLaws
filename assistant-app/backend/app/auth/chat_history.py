from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from bson import ObjectId

from app.auth.models import UserInDB
from app.auth.utils import get_current_active_user, users_collection

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatMessage(BaseModel):
    role: str
    content: str
    articles: Optional[List[dict]] = []


class ChatSession(BaseModel):
    id: str
    title: str
    date: datetime
    messages: List[ChatMessage]
    articles: Optional[List[dict]] = []


class ChatSessionUpdate(BaseModel):
    title: Optional[str] = None


@router.post("/history", status_code=201)
async def create_chat_session(
    message: ChatMessage,
    user: UserInDB = Depends(get_current_active_user)
):
    """Create a new chat session with the first message"""
    
    # Create title from first message (truncate if needed)
    title = message.content[:30] + "..." if len(message.content) > 30 else message.content
    
    # Create new session
    session = {
        "id": str(ObjectId()),
        "title": title,
        "date": datetime.utcnow(),
        "messages": [message.dict()],
        "articles": message.articles if message.role == "assistant" else []
    }
    
    # Update user document - with async
    result = await users_collection.update_one(
        {"email": user.email},
        {"$push": {"chat_sessions": session}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to create chat session")
    
    return {"id": session["id"], "title": session["title"]}


@router.get("/history", response_model=List[ChatSession])
async def get_chat_history(user: UserInDB = Depends(get_current_active_user)):
    """Get all chat sessions for the current user"""
    
    # Get user document with chat sessions - with async
    user_data = await users_collection.find_one(
        {"email": user.email},
        {"_id": 0, "chat_sessions": 1}
    )
    
    if not user_data or "chat_sessions" not in user_data:
        return []
    
    # Sort chat sessions by date (newest first)
    chat_sessions = sorted(
        user_data["chat_sessions"], 
        key=lambda x: x.get("date", datetime.min), 
        reverse=True
    )
    
    return chat_sessions


@router.get("/history/{session_id}", response_model=ChatSession)
async def get_chat_session(
    session_id: str,
    user: UserInDB = Depends(get_current_active_user)
):
    """Get a specific chat session by ID"""
    
    # Find user with the specific chat session - with async
    user_data = await users_collection.find_one(
        {
            "email": user.email,
            "chat_sessions.id": session_id
        },
        {"_id": 0, "chat_sessions.$": 1}
    )
    
    if not user_data or "chat_sessions" not in user_data or not user_data["chat_sessions"]:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    return user_data["chat_sessions"][0]


@router.delete("/history/{session_id}")
async def delete_chat_session(
    session_id: str,
    user: UserInDB = Depends(get_current_active_user)
):
    """Delete a specific chat session by ID"""
    
    # With async
    result = await users_collection.update_one(
        {"email": user.email},
        {"$pull": {"chat_sessions": {"id": session_id}}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    return {"detail": "Chat session deleted successfully"}


@router.delete("/history")
async def delete_all_chat_sessions(
    user: UserInDB = Depends(get_current_active_user)
):
    """Delete all chat sessions for the current user"""
    
    # With async
    result = await users_collection.update_one(
        {"email": user.email},
        {"$set": {"chat_sessions": []}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to delete chat sessions")
    
    return {"detail": "All chat sessions deleted successfully"}


@router.patch("/history/{session_id}", response_model=ChatSession)
async def update_chat_session(
    session_id: str,
    update_data: ChatSessionUpdate,
    user: UserInDB = Depends(get_current_active_user)
):
    """Update a chat session (currently only title can be updated)"""
    
    update_fields = {f"chat_sessions.$.{k}": v for k, v in update_data.dict(exclude_unset=True).items()}
    
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # With async
    result = await users_collection.update_one(
        {
            "email": user.email,
            "chat_sessions.id": session_id
        },
        {"$set": update_fields}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    # Get the updated session
    updated_session = await get_chat_session(session_id, user)
    return updated_session