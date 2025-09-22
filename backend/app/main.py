from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.storage import get_counts, cast_vote, has_voted, has_voted_for_category, get_results, reset_all_votes, update_user_activity, get_concurrent_users, has_ip_voted_for_category
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
    
    # Enhanced security validation
    fingerprint = security_data.get("fingerprint")
    session_key = security_data.get("sessionKey")
    timestamp = security_data.get("timestamp", 0)
    
    # Validate timestamp (within 5 minutes)
    import time
    current_time = int(time.time() * 1000)
    if abs(current_time - timestamp) > 300000:  # 5 minutes
        return {"success": False, "message": "Request expired"}
    
    # Validate user authentication
    user_id = user_data.get("id")
    user_email = user_data.get("email")
    user_provider = user_data.get("provider")
    
    if not user_id or not user_email or not user_provider:
        return {"success": False, "message": "Authentication required"}
    
    # Validate security data
    if not fingerprint or not session_key or len(session_key) != 64:
        return {"success": False, "message": "Invalid security data"}
    
    # Create enhanced device token with security and user data
    enhanced_token = f"{device_token}:{fingerprint}:{client_ip}"
    social_user_token = f"{user_provider}:{user_id}"
    
    # Track user activity
    update_user_activity(enhanced_token)
    
    # Check multiple vote prevention methods
    if has_voted_for_category(enhanced_token, category):
        return {"success": False, "message": "Already voted for this category"}
    
    if has_ip_voted_for_category(client_ip, category):
        return {"success": False, "message": "This IP address has already voted for this category"}
    
    # Check social account voting (primary prevention)
    if has_voted_for_category(social_user_token, category):
        return {"success": False, "message": "This social account has already voted for this category"}
    
    # Check fingerprint-based voting
    if has_voted_for_category(fingerprint, category):
        return {"success": False, "message": "This device has already voted for this category"}
    
    if cast_vote(enhanced_token, category, candidate_name, client_ip):
        # Also record social account and fingerprint votes
        cast_vote(social_user_token, category, candidate_name, client_ip)
        cast_vote(fingerprint, category, candidate_name, client_ip)
        return {"success": True, "message": "Vote recorded", "category": category, "candidate": candidate_name, "user": user_email}
    else:
        return {"success": False, "message": "Invalid category"}

@app.post("/api/v1/reset")
def reset_votes():
    try:
        reset_all_votes()
        # Return current counts to verify reset worked
        current_counts = get_counts()
        return {
            "success": True, 
            "message": "All votes have been reset",
            "counts": current_counts
        }
    except Exception as e:
        return {"success": False, "message": f"Error: {str(e)}"}
