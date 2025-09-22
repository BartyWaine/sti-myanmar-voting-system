import os
from app.database import (
    get_vote_counts as get_vote_counts_db,
    cast_vote_db,
    has_voted_for_category_db,
    get_results_db,
    reset_all_votes_db,
    update_user_activity_db,
    get_concurrent_users_db,
    init_database
)

# Initialize database on startup
init_database()

# Fallback in-memory storage for local development
vote_counts = {
    "King": 0,
    "Queen": 0,
    "Prince": 0,
    "Princess": 0,
    "Best Costume Male": 0,
    "Best Costume Female": 0,
    "Best Performance Award": 0
}

candidate_votes = {
    "King": {},
    "Queen": {},
    "Prince": {},
    "Princess": {},
    "Best Costume Male": {},
    "Best Costume Female": {},
    "Best Performance Award": {}
}

votes = {}
ip_votes = {}
active_users = set()
last_seen = {}

def get_counts():
    # Use database if available, otherwise fallback to in-memory
    if os.getenv('DATABASE_URL'):
        return get_vote_counts_db()
    
    total = sum(vote_counts.values())
    return {
        "King": vote_counts["King"],
        "Queen": vote_counts["Queen"],
        "Prince": vote_counts["Prince"],
        "Princess": vote_counts["Princess"],
        "Best Costume Male": vote_counts["Best Costume Male"],
        "Best Costume Female": vote_counts["Best Costume Female"],
        "Best Performance Award": vote_counts["Best Performance Award"],
        "total": total
    }

def cast_vote(device_token: str, category: str, candidate_name: str = None, client_ip: str = None):
    # Use database if available
    if os.getenv('DATABASE_URL'):
        return cast_vote_db(device_token, category, candidate_name)
    
    # Fallback to in-memory
    if category not in vote_counts:
        return False
    
    if device_token not in votes:
        votes[device_token] = set()
    
    if category in votes[device_token]:
        return False
    
    votes[device_token].add(category)
    vote_counts[category] += 1
    
    if client_ip:
        if client_ip not in ip_votes:
            ip_votes[client_ip] = set()
        ip_votes[client_ip].add(category)
    
    if candidate_name:
        if candidate_name not in candidate_votes[category]:
            candidate_votes[category][candidate_name] = 0
        candidate_votes[category][candidate_name] += 1
    
    return True

def has_voted(device_token: str):
    return device_token in votes

def has_voted_for_category(device_token: str, category: str):
    # Use database if available
    if os.getenv('DATABASE_URL'):
        return has_voted_for_category_db(device_token, category)
    
    # Fallback to in-memory
    return device_token in votes and category in votes[device_token]

def reset_all_votes():
    # Use database if available
    if os.getenv('DATABASE_URL'):
        reset_all_votes_db()
        return
    
    # Fallback to in-memory
    global vote_counts, candidate_votes, votes, ip_votes
    for category in vote_counts:
        vote_counts[category] = 0
    for category in candidate_votes:
        candidate_votes[category] = {}
    votes = {}
    ip_votes = {}

def has_ip_voted_for_category(client_ip: str, category: str):
    return client_ip in ip_votes and category in ip_votes[client_ip]

def update_user_activity(device_token: str):
    # Use database if available
    if os.getenv('DATABASE_URL'):
        update_user_activity_db(device_token)
        return
    
    # Fallback to in-memory
    import time
    active_users.add(device_token)
    last_seen[device_token] = time.time()
    
    current_time = time.time()
    inactive_users = [token for token, last_time in last_seen.items() 
                     if current_time - last_time > 30]
    for token in inactive_users:
        active_users.discard(token)
        del last_seen[token]

def get_concurrent_users():
    # Use database if available
    if os.getenv('DATABASE_URL'):
        return get_concurrent_users_db()
    
    # Fallback to in-memory
    import time
    current_time = time.time()
    inactive_users = [token for token, last_time in last_seen.items() 
                     if current_time - last_time > 30]
    for token in inactive_users:
        active_users.discard(token)
        del last_seen[token]
    return len(active_users)

def get_results():
    # Use database if available
    if os.getenv('DATABASE_URL'):
        return get_results_db()
    
    # Fallback to in-memory
    results = {}
    for category in vote_counts:
        if candidate_votes[category]:
            max_votes = max(candidate_votes[category].values())
            tied_candidates = [name for name, votes in candidate_votes[category].items() if votes == max_votes]
            
            if len(tied_candidates) == 1:
                leading_text = tied_candidates[0]
            else:
                leading_text = f"Tie: {', '.join(tied_candidates)}"
            
            percentage = (max_votes / vote_counts[category] * 100) if vote_counts[category] > 0 else 0
            
            results[category] = {
                "leading_candidate": leading_text,
                "votes": max_votes,
                "total_votes": vote_counts[category],
                "percentage": round(percentage, 1),
                "all_candidates": dict(candidate_votes[category])
            }
        else:
            results[category] = {
                "leading_candidate": "No votes yet",
                "votes": 0,
                "total_votes": vote_counts[category],
                "percentage": 0,
                "all_candidates": {}
            }
    
    return results