from pymongo import MongoClient, ASCENDING
import os

# MongoDB connection
MONGO_CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING", "mongodb://localhost:27017")
client = MongoClient(MONGO_CONNECTION_STRING)
db = client.juridoc_db

def init_db():
    """Initialize database with required collections and indexes."""
    # Create users collection if it doesn't exist
    if "users" not in db.list_collection_names():
        db.create_collection("users")
    
    # Create indexes
    db.users.create_index([("email", ASCENDING)], unique=True)
    
    print("Database initialization completed successfully!")

if __name__ == "__main__":
    init_db()