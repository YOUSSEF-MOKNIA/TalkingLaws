import requests
import json

BASE_URL = "http://localhost:8000"

def test_register():
    """Test user registration."""
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "password123"
        }
    )
    print(f"Register Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()

def test_login():
    """Test user login."""
    response = requests.post(
        f"{BASE_URL}/auth/token",
        data={
            "username": "test@example.com",
            "password": "password123"
        }
    )
    print(f"Login Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()

def test_me(token):
    """Test getting current user info."""
    response = requests.get(
        f"{BASE_URL}/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Me Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def test_ask_question(token):
    """Test asking a question with authentication."""
    response = requests.post(
        f"{BASE_URL}/ask",
        json={
            "question": "Quelles sont les conditions pour obtenir un divorce au Maroc?",
            "stream": False
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Ask Question Status: {response.status_code}")
    if response.status_code == 200:
        print("Response received successfully!")
    else:
        print(json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    # Uncomment the line below to register a new user (only needed once)
    # test_register()
    
    # Login and get token
    login_data = test_login()
    if "access_token" in login_data:
        token = login_data["access_token"]
        
        # Test getting user info
        test_me(token)
        
        # Test asking a question
        test_ask_question(token)