from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uuid
import boto3
from datetime import datetime

app = FastAPI()

# For local dev, comment boto3 lines or use mock DB
try:
    db = boto3.resource("dynamodb")
    VOTES_TABLE = db.Table("Votes")
    COUNTS_TABLE = db.Table("VoteCounts")
except Exception:
    VOTES_TABLE = None
    COUNTS_TABLE = None

CATEGORIES = ["King","Queen","Prince","Princess","Best Costume Male","Best Costume Female","Best Performance Award"]

class RegisterRequest(BaseModel):
    display_name: str | None = None

class VoteRequest(BaseModel):
    device_token: str
    category: str

@app.post("/api/v1/register-device")
def register_device(req: RegisterRequest):
    token = str(uuid.uuid4())
    return {"device_token": token}

@app.post("/api/v1/vote")
def vote(req: VoteRequest):
    if req.category not in CATEGORIES:
        raise HTTPException(status_code=400, detail="invalid category")
    if VOTES_TABLE is None:
        return {"status":"ok","note":"No DB configured"}
    try:
        VOTES_TABLE.put_item(
            Item={"vote_category": req.category,"device_token": req.device_token,"timestamp": datetime.utcnow().isoformat()},
            ConditionExpression="attribute_not_exists(device_token)")
    except Exception:
        raise HTTPException(status_code=409, detail="already_voted")
    COUNTS_TABLE.update_item(Key={"category": req.category},
        UpdateExpression="ADD #c :inc",
        ExpressionAttributeNames={"#c":"count"},
        ExpressionAttributeValues={":inc":1})
    return {"status": "ok"}

@app.get("/api/v1/counts")
def counts():
    if COUNTS_TABLE is None:
        return {c:0 for c in CATEGORIES}
    resp = COUNTS_TABLE.scan()
    items = {it['category']: int(it.get('count',0)) for it in resp.get('Items', [])}
    return {c: items.get(c,0) for c in CATEGORIES}
