from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
from bson import ObjectId
from datetime import datetime

from .gemini_pipeline import GeminiLegalRAGPipeline, format_article_response
from .auth.router import router as auth_router
from .auth.chat_history import router as chat_router
from .auth.utils import get_current_active_user, users_collection
from .auth.models import UserInDB

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(chat_router)

class QuestionRequest(BaseModel):
    question: str
    chat_id: str = None
    stream: bool = False

# Initialize the RAG pipeline once at startup
pipeline = GeminiLegalRAGPipeline()

@app.post("/ask")
async def ask_question(
    request: QuestionRequest,
    current_user: UserInDB = Depends(get_current_active_user)
):
    if request.stream:
        return StreamingResponse(
            stream_response(request.question, current_user, request.chat_id),
            media_type="text/event-stream"
        )
    else:
        response, documents, _ = pipeline.answer_question(request.question, stream=False)
        articles = [format_article_response(doc) for doc in documents]
        
        # Handle chat storage
        chat_id = await save_to_chat_history(
            current_user,
            request.question,
            response,
            articles,
            request.chat_id
        )
        
        return {
            "answer": response,
            "articles": articles,
            "chat_id": chat_id
        }

async def stream_response(query: str, user: UserInDB, chat_id: str = None):
    """Stream the response token by token."""
    response, documents, _ = pipeline.answer_question(query, stream=True)
    articles = [format_article_response(doc) for doc in documents]
    
    # Save to user's chat history
    chat_id = await save_to_chat_history(user, query, response, articles, chat_id)
    
    # First send the articles
    yield f"data: {json.dumps({'type': 'articles', 'articles': articles, 'chat_id': chat_id})}\n\n"
    
    # Then stream the response
    for char in response:
        yield f"data: {json.dumps({'type': 'token', 'token': char})}\n\n"
    
    # Finally, send the complete response
    yield f"data: {json.dumps({'type': 'complete', 'response': response, 'chat_id': chat_id})}\n\n"

async def save_to_chat_history(user, question, answer, articles, existing_chat_id=None):
    """
    Save the question and answer to the user's chat history.
    If chat_id is provided, append to that chat, otherwise create a new one.
    """
    # Create message objects
    user_message = {
        "role": "user", 
        "content": question
    }
    
    assistant_message = {
        "role": "assistant",
        "content": answer,
        "articles": articles
    }
    
    if existing_chat_id:
        # Append messages to existing chat - with async
        result = await users_collection.update_one(
            {
                "email": user.email,
                "chat_sessions.id": existing_chat_id
            },
            {
                "$push": {
                    "chat_sessions.$.messages": {
                        "$each": [user_message, assistant_message]
                    }
                },
                "$set": {
                    "chat_sessions.$.articles": articles
                }
            }
        )
        
        if result.modified_count == 0:
            # Chat not found, create new one
            return await create_new_chat(user, question, answer, articles)
        
        return existing_chat_id
    else:
        # Create new chat
        return await create_new_chat(user, question, answer, articles)

async def create_new_chat(user, question, answer, articles):
    """Create a new chat session"""
    chat_id = str(ObjectId())
    
    # Create title from first message (truncate if needed)
    title = question[:30] + "..." if len(question) > 30 else question
    
    chat_session = {
        "id": chat_id,
        "title": title,
        "date": datetime.utcnow(),
        "messages": [
            {
                "role": "user",
                "content": question
            },
            {
                "role": "assistant", 
                "content": answer,
                "articles": articles
            }
        ],
        "articles": articles
    }
    
    # Use proper async
    await users_collection.update_one(
        {"email": user.email},
        {"$push": {"chat_sessions": chat_session}}
    )
    
    return chat_id

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "JuriDOC API is running"}