import hashlib
import secrets
import time
from typing import Optional

# Simple in-memory user storage (replace with database in production)
users_db = {}
sessions_db = {}

def hash_password(password: str) -> str:
    """Hash password with salt"""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return f"{salt}:{pwd_hash.hex()}"

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    try:
        salt, pwd_hash = hashed.split(':')
        return hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000).hex() == pwd_hash
    except:
        return False

def create_user(email: str, password: str, name: str) -> dict:
    """Create new user account"""
    if email in users_db:
        return {"success": False, "message": "Email already registered"}
    
    user_id = f"user_{int(time.time())}_{secrets.token_hex(4)}"
    users_db[email] = {
        "id": user_id,
        "email": email,
        "name": name,
        "password": hash_password(password),
        "created_at": time.time()
    }
    
    return {"success": True, "message": "Account created successfully"}

def authenticate_user(email: str, password: str) -> dict:
    """Authenticate user login"""
    if email not in users_db:
        return {"success": False, "message": "Invalid email or password"}
    
    user = users_db[email]
    if not verify_password(password, user["password"]):
        return {"success": False, "message": "Invalid email or password"}
    
    # Create session
    session_token = secrets.token_hex(32)
    sessions_db[session_token] = {
        "user_id": user["id"],
        "email": email,
        "created_at": time.time()
    }
    
    return {
        "success": True,
        "message": "Login successful",
        "token": session_token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"]
        }
    }

def verify_session(token: str) -> Optional[dict]:
    """Verify session token"""
    if token not in sessions_db:
        return None
    
    session = sessions_db[token]
    # Session expires after 24 hours
    if time.time() - session["created_at"] > 86400:
        del sessions_db[token]
        return None
    
    email = session["email"]
    if email in users_db:
        user = users_db[email]
        return {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"]
        }
    
    return None

def logout_user(token: str) -> bool:
    """Logout user by removing session"""
    if token in sessions_db:
        del sessions_db[token]
        return True
    return False