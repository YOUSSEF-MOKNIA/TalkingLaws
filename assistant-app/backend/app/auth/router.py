from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from app.auth.models import Token, UserCreate, UserResponse, UserInDB
from app.auth.utils import (
    authenticate_user, create_access_token, get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES, users_collection, get_current_active_user
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    # Check if user exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_dict = user_data.dict()
    user_dict.pop("password")
    hashed_password = get_password_hash(user_data.password)
    
    user_in_db = UserInDB(
        **user_dict,
        hashed_password=hashed_password,
        chat_sessions=[]  # Initialize with empty chat sessions
    )
    
    try:
        result = await users_collection.insert_one(user_in_db.dict(by_alias=True))
        user_id = result.inserted_id
        created_user = await users_collection.find_one({"_id": user_id})
        return {
            "id": str(created_user["_id"]),
            "email": created_user["email"],
            "full_name": created_user["full_name"],
            "is_active": created_user["is_active"]
        }
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Add 'await' here to resolve the coroutine
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},  # Use email as subject
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: UserInDB = Depends(get_current_active_user)):
    return {
        "id": str(current_user.id) if hasattr(current_user, 'id') else None,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_active": current_user.is_active
    }