# Simple in-memory storage
vote_counts = {
    "King": 0,
    "Queen": 0,
    "Prince": 0,
    "Princess": 0,
    "Best Costume Male": 0,
    "Best Costume Female": 0,
    "Best Performance Award": 0
}

# Track individual candidate votes: category -> {candidate_name: vote_count}
candidate_votes = {
    "King": {},
    "Queen": {},
    "Prince": {},
    "Princess": {},
    "Best Costume Male": {},
    "Best Costume Female": {},
    "Best Performance Award": {}
}

votes = {}  # device_token -> set of categories

def get_counts():
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

def cast_vote(device_token: str, category: str, candidate_name: str = None):
    if category not in vote_counts:
        return False
    
    if device_token not in votes:
        votes[device_token] = set()
    
    if category in votes[device_token]:
        return False  # Already voted for this category
    
    votes[device_token].add(category)
    vote_counts[category] += 1
    
    # Track individual candidate votes
    if candidate_name:
        if candidate_name not in candidate_votes[category]:
            candidate_votes[category][candidate_name] = 0
        candidate_votes[category][candidate_name] += 1
    
    return True

def has_voted(device_token: str):
    return device_token in votes

def has_voted_for_category(device_token: str, category: str):
    return device_token in votes and category in votes[device_token]

def get_results():
    results = {}
    for category in vote_counts:
        if candidate_votes[category]:
            # Find the highest vote count
            max_votes = max(candidate_votes[category].values())
            # Find all candidates with the highest vote count
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