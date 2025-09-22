from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.storage import get_counts, cast_vote, has_voted, has_voted_for_category, get_results, reset_all_votes, update_user_activity, get_concurrent_users, has_ip_voted_for_category
try:
    from app.auth import create_user, authenticate_user, verify_session, logout_user
    AUTH_ENABLED = True
except ImportError:
    AUTH_ENABLED = False
    def create_user(*args): return {"success": False, "message": "Auth not available"}
    def authenticate_user(*args): return {"success": False, "message": "Auth not available"}
    def verify_session(*args): return None
    def logout_user(*args): return False
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "https://bartywaine.github.io",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Voting Dashboard API"}

@app.get("/api/v1/create-demo-account")
def create_demo_account():
    if not AUTH_ENABLED:
        return {"success": False, "message": "Auth system not available"}
    result = create_user("demo@test.com", "123456", "Demo User")
    return result

@app.post("/api/v1/register-device")
def register_device(device: dict):
    device_id = str(uuid.uuid4())
    update_user_activity(device_id)
    return {"device_id": device_id, "display_name": device.get("display_name")}

@app.get("/api/v1/users")
def get_user_stats():
    return {
        "concurrent_users": get_concurrent_users(),
        "total_votes": get_counts().get('total', 0)
    }

@app.get("/api/v1/counts")
def get_vote_counts():
    return get_counts()

@app.get("/api/v1/results")
def get_live_results():
    return get_results()

@app.post("/api/v1/vote")
def vote(vote_data: dict, request: Request):
    device_token = vote_data.get("device_token")
    category = vote_data.get("category")
    candidate_name = vote_data.get("candidate_name")
    security_data = vote_data.get("security", {})
    user_data = vote_data.get("user", {})
    
    # Get client IP address
    client_ip = request.client.host
    if "x-forwarded-for" in request.headers:
        client_ip = request.headers["x-forwarded-for"].split(",")[0].strip()
    
    # No security validation - allow all votes
    import time
    
    # No authentication required - allow all votes
    user_id = "demo_user_" + str(int(time.time()))
    user_email = "demo@sti.edu"
    
    # Use simple fallback values
    fingerprint = security_data.get("fingerprint", "demo_fingerprint")
    session_key = security_data.get("sessionKey", "demo_session_key_12345678901234567890123456789012345678901234567890123456789012")
    
    # Get browser fingerprint data
    user_agent = request.headers.get("user-agent", "")
    accept_language = request.headers.get("accept-language", "")
    browser_fingerprint = f"{user_agent}_{accept_language}_{client_ip}"
    
    # Enhanced device fingerprinting to prevent VPN bypass
    enhanced_token = f"{device_token}:{client_ip}"
    fingerprint_token = f"fp:{fingerprint}"
    device_only_token = f"device:{device_token}"
    browser_token = f"browser:{hash(browser_fingerprint)}"
    session_token = f"session:{session_key[:32]}"
    
    # Track user activity
    update_user_activity(enhanced_token)
    
    # Multiple checks to prevent VPN bypass and browser switching
    if has_voted_for_category(enhanced_token, category):
        return {"success": False, "message": "Already voted for this category"}
    
    if has_voted_for_category(fingerprint_token, category):
        return {"success": False, "message": "This device has already voted for this category"}
    
    if has_voted_for_category(device_only_token, category):
        return {"success": False, "message": "This device has already voted for this category"}
    
    if has_voted_for_category(browser_token, category):
        return {"success": False, "message": "This browser has already voted for this category"}
    
    if has_voted_for_category(session_token, category):
        return {"success": False, "message": "This session has already voted for this category"}
    
    if has_ip_voted_for_category(client_ip, category):
        return {"success": False, "message": "This network/IP has already voted for this category"}
    
    if cast_vote(enhanced_token, category, candidate_name, client_ip):
        # Record with all tokens to prevent any bypass method
        cast_vote(fingerprint_token, category, candidate_name, client_ip)
        cast_vote(device_only_token, category, candidate_name, client_ip)
        cast_vote(browser_token, category, candidate_name, client_ip)
        cast_vote(session_token, category, candidate_name, client_ip)
        return {"success": True, "message": "Vote recorded", "category": category, "candidate": candidate_name, "user": user_email}
    else:
        return {"success": False, "message": "Invalid category"}

@app.post("/api/v1/register")
def register(user_data: dict):
    if not AUTH_ENABLED:
        return {"success": False, "message": "Auth system not available"}
    
    email = user_data.get("email", "").strip().lower()
    password = user_data.get("password", "")
    name = user_data.get("name", "").strip()
    
    if not email or not password or not name:
        return {"success": False, "message": "All fields are required"}
    
    if len(password) < 6:
        return {"success": False, "message": "Password must be at least 6 characters"}
    
    return create_user(email, password, name)

@app.post("/api/v1/login")
def login(login_data: dict):
    if not AUTH_ENABLED:
        return {"success": False, "message": "Auth system not available"}
    
    email = login_data.get("email", "").strip().lower()
    password = login_data.get("password", "")
    
    if not email or not password:
        return {"success": False, "message": "Email and password are required"}
    
    return authenticate_user(email, password)

@app.post("/api/v1/logout")
def logout(logout_data: dict):
    if not AUTH_ENABLED:
        return {"success": True, "message": "Auth system not available"}
    
    token = logout_data.get("token", "")
    logout_user(token)
    return {"success": True, "message": "Logged out successfully"}

@app.post("/api/v1/verify")
def verify_token(token_data: dict):
    if not AUTH_ENABLED:
        return {"success": False, "message": "Auth system not available"}
    
    token = token_data.get("token", "")
    user = verify_session(token)
    
    if user:
        return {"success": True, "user": user}
    else:
        return {"success": False, "message": "Invalid or expired session"}

@app.post("/api/v1/reset")
def reset_votes():
    try:
        reset_all_votes()
        current_counts = get_counts()
        return {
            "success": True, 
            "message": "All votes have been reset",
            "counts": current_counts
        }
    except Exception as e:
        return {"success": False, "message": f"Error: {str(e)}"}
