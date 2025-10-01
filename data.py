import json
from pathlib import Path
from datetime import datetime

DATA_FILE = Path("data.json")

def load_data():
    if not DATA_FILE.exists():
        DATA_FILE.write_text(json.dumps({"users": {}}))
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

# ----------------------------
# Record idea shared and earnings
# ----------------------------
def record_idea_earning(user_id: str, idea_id: str, profit: float):
    data = load_data()
    user = data["users"].get(user_id, {
        "name": "user",
        "total_earned": 0,
        "ideas_shared": [],
        "vouches": 0
    })
    
    user["total_earned"] += profit
    user["ideas_shared"].append({
        "idea_id": idea_id,
        "profit": profit,
        "timestamp": datetime.now().isoformat()
    })
    
    data["users"][user_id] = user
    save_data(data)
    return user

# ----------------------------
# Record entrepreneur commission/payment
# ----------------------------
def record_entrepreneur_payment(ent_id: str, idea_id: str, amount: float, verified: bool):
    data = load_data()
    ent = data["users"].get(ent_id, {
        "name": "user",
        "total_paid": 0,
        "verified": False,
        "commissions": []
    })
    
    ent["total_paid"] += amount
    ent["commissions"].append({
        "idea_id": idea_id,
        "amount": amount,
        "verified": verified,
        "timestamp": datetime.now().isoformat()
    })
    
    if verified:
        ent["verified"] = True
    
    data["users"][ent_id] = ent
    save_data(data)
    return ent

# ----------------------------
# Add vouches to improve credibility
# ----------------------------
def add_vouch(user_id: str, count: int = 1):
    data = load_data()
    user = data["users"].get(user_id, {"name": "user", "vouches": 0})
    user["vouches"] = user.get("vouches", 0) + count
    data["users"][user_id] = user
    save_data(data)
    return user

# ----------------------------
# Fetch user revenue/earnings
# ----------------------------
def get_user_stats(user_id: str):
    data = load_data()
    return data["users"].get(user_id, {"name": "user"})