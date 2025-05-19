from datetime import datetime, timedelta
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId
from pydantic_core import core_schema

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        # This is kept for backward compatibility
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)
    
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        return core_schema.union_schema([
            core_schema.is_instance_schema(ObjectId),
            core_schema.chain_schema([
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ]),
        ])


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserInDB(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    chat_history: List[str] = []

    class Config:
        validate_by_name = True  # Instead of allow_population_by_field_name
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }


class UserResponse(UserBase):
    id: str

    class Config:
        allow_population_by_field_name = True


class TokenData(BaseModel):
    email: str = None  # Changed from Optional[str] to ensure the field exists

class Token(BaseModel):
    access_token: str
    token_type: str