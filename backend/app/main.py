from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.storage import get_counts, cast_vote, has_voted, has_voted_for_category, get_results, reset_all_votes, update_user_activity, get_concurrent_users
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins temporarily
    allow_credentials=False,  # Set to False when using allow_origins=["*"]
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
def vote(vote_data: dict):
    device_token = vote_data.get("device_token")
    category = vote_data.get("category")
    candidate_name = vote_data.get("candidate_name")
    
    # Track user activity
    update_user_activity(device_token)
    
    if has_voted_for_category(device_token, category):
        return {"success": False, "message": "Already voted for this category"}
    
    if cast_vote(device_token, category, candidate_name):
        return {"success": True, "message": "Vote recorded", "category": category, "candidate": candidate_name}
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
