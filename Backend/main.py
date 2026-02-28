from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import json
import os
import requests
import sys

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Major Social Media Platforms
# --------------------------------------------------
COMMON_PLATFORMS = {
    "Instagram": "https://www.instagram.com/{username}/",
    "Twitter": "https://twitter.com/{username}",
    "Reddit": "https://www.reddit.com/user/{username}",
    "Medium": "https://medium.com/@{username}",
    "Pinterest": "https://www.pinterest.com/{username}/",
    "LinkedIn": "https://www.linkedin.com/in/{username}/",
}


# --------------------------------------------------
# Risk Calculation
# --------------------------------------------------
def compute_risk(platform_count, github_data, name, email):
    score = 0

    # Platform exposure
    if platform_count >= 8:
        score += 60
    elif platform_count >= 5:
        score += 40
    elif platform_count >= 2:
        score += 25
    elif platform_count >= 1:
        score += 15

    # GitHub exposure
    if github_data.get("exists"):
        score += 15

        repos = github_data.get("public_repos", 0)
        followers = github_data.get("followers", 0)

        if repos > 20:
            score += 15
        elif repos > 5:
            score += 10

        if followers > 100:
            score += 10

    # Identity correlation
    if name:
        score += 5

    if email:
        score += 10

    return min(score, 100)


# --------------------------------------------------
# GitHub API Check
# --------------------------------------------------
def check_github(username):
    try:
        response = requests.get(
            f"https://api.github.com/users/{username}",
            timeout=10
        )

        if response.status_code == 200:
            data = response.json()
            return {
                "exists": True,
                "followers": data.get("followers", 0),
                "public_repos": data.get("public_repos", 0),
                "profile_url": data.get("html_url")
            }
    except:
        pass

    return {"exists": False}


# --------------------------------------------------
# Manual Platform Check
# --------------------------------------------------
def check_common_platforms(username):
    found = []
    headers = {"User-Agent": "Mozilla/5.0"}

    for platform, url in COMMON_PLATFORMS.items():
        try:
            response = requests.get(
                url.format(username=username),
                headers=headers,
                timeout=8,
                allow_redirects=True
            )

            if response.status_code in [200, 301, 302]:
                found.append(platform)

        except:
            pass

    return found


# --------------------------------------------------
# Sherlock Scan (100+ sites)
# --------------------------------------------------
def run_sherlock(username):
    json_file = f"{username}_sherlock.json"
    found = []

    try:
        subprocess.run(
            [sys.executable, "-m", "sherlock", username, "--json", json_file],
            capture_output=True,
            text=True,
            timeout=60
        )

        if os.path.exists(json_file):
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)

            os.remove(json_file)

            found = [
                site for site, info in data.items()
                if info.get("status") == "claimed"
            ]
    except:
        pass

    return found


# --------------------------------------------------
# MAIN ANALYZE ENDPOINT
# --------------------------------------------------
@app.post("/analyze")
def analyze(payload: dict):

    username = payload.get("username")
    name = payload.get("name")
    email = payload.get("email")

    if not username:
        return {"error": "Username required"}

    # 1️⃣ Sherlock
    sherlock_platforms = run_sherlock(username)

    # 2️⃣ Manual checks
    http_platforms = check_common_platforms(username)

    # 3️⃣ GitHub
    github_data = check_github(username)

    # Merge platforms
    platforms_found = list(set(sherlock_platforms + http_platforms))

    if github_data.get("exists"):
        platforms_found.append("GitHub")

    platforms_found = list(set(platforms_found))

    # --------------------------------------------------
    # Graph Nodes
    # --------------------------------------------------
    nodes = [
        {"id": "identity", "label": username, "type": "identity"}
    ]

    if name:
        nodes.append({
            "id": "name",
            "label": name,
            "type": "attribute"
        })

    if email:
        nodes.append({
            "id": "email",
            "label": email,
            "type": "attribute"
        })

    for platform in platforms_found:
        nodes.append({
            "id": platform.lower().replace(" ", ""),
            "label": platform,
            "type": "platform"
        })

    # --------------------------------------------------
    # Graph Links
    # --------------------------------------------------
    links = []

    for platform in platforms_found:
        links.append({
            "source": "identity",
            "target": platform.lower().replace(" ", ""),
            "strength": 0.8
        })

    if name:
        links.append({
            "source": "identity",
            "target": "name",
            "strength": 0.9
        })

    if email:
        links.append({
            "source": "identity",
            "target": "email",
            "strength": 0.9
        })

    # --------------------------------------------------
    # Exposure Simulation
    # --------------------------------------------------
    exposure = {
        "email_exposed": False,
        "location_exposed": False,
        "phone_exposed": False,
        "password_leaked": False,
        "personal_details_exposed": False
    }

    if email:
        exposure["email_exposed"] = True
        exposure["personal_details_exposed"] = True

    if len(platforms_found) > 5:
        exposure["location_exposed"] = True

    if len(platforms_found) > 8:
        exposure["phone_exposed"] = True

    if github_data.get("exists") and github_data.get("public_repos", 0) > 15:
        exposure["password_leaked"] = True

    # --------------------------------------------------
    # Risk Score
    # --------------------------------------------------
    risk_score = compute_risk(len(platforms_found), github_data, name, email)

    if exposure["password_leaked"]:
        risk_score += 20

    if exposure["phone_exposed"]:
        risk_score += 10

    risk_score = min(risk_score, 100)

    if risk_score >= 60:
        risk_level = "High"
    elif risk_score >= 30:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    # --------------------------------------------------
    # Final Response
    # --------------------------------------------------
    return {
        "username": username,
        "nodes": nodes,
        "links": links,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "platforms": [
            {
                "name": platform,
                "matched": True,
                "confidence": 80
            }
            for platform in platforms_found
        ],
        "exposure": exposure
    }