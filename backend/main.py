import json
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


app = FastAPI()


# -------------------------------------------------
# FILE PATHS
# -------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

CURRICULUM_PATH = BASE_DIR / "data" / "curriculum.json"
CANDIDATES_PATH = BASE_DIR / "data" / "candidates.json"


# -------------------------------------------------
# LOAD JSON DATA
# -------------------------------------------------

def load_json(path: Path):
    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


curriculum_data = load_json(CURRICULUM_PATH)
candidates_data = load_json(CANDIDATES_PATH)


# -------------------------------------------------
# TEMPORARY SESSION STORAGE
# -------------------------------------------------

sessions = {}


# -------------------------------------------------
# REQUEST MODEL
# -------------------------------------------------

class InterviewRequest(BaseModel):
    sessionId: str
    candidate: dict[str, Any] | None = None
    message: str | None = None


# -------------------------------------------------
# PERSONALIZATION
# -------------------------------------------------

def select_interview_topics(candidate: dict[str, Any]):

    missions = candidate.get("missions", [])

    if not missions:
        return []

    # Prioritize:
    # 1. Skipped missions
    # 2. Missions that needed more attempts
    sorted_missions = sorted(
        missions,
        key=lambda mission: (
            mission.get("skipped", False),
            mission.get("attempts", 0)
        ),
        reverse=True
    )

    selected_missions = sorted_missions[:4]

    selected_topics = []

    for mission in selected_missions:

        mission_day = mission.get("day")

        curriculum_day = next(
            (
                day
                for day in curriculum_data["days"]
                if day["day"] == mission_day
            ),
            None
        )

        if curriculum_day is not None:

            selected_topics.append(
                {
                    "day": curriculum_day["day"],
                    "title": curriculum_day["title"],
                    "type": curriculum_day["type"],
                    "tools": curriculum_day["tools"],
                    "objectives": curriculum_day["objectives"],
                    "passed": mission.get("passed", False),
                    "skipped": mission.get("skipped", False),
                    "attempts": mission.get("attempts", 0)
                }
            )

    return selected_topics


# -------------------------------------------------
# INTERVIEW ENDPOINT
# -------------------------------------------------

@app.post("/api/interview")
def interview(request: InterviewRequest):

    session_id = request.sessionId

    # ---------------------------------------------
    # START INTERVIEW
    # ---------------------------------------------

    if request.candidate is not None:

        if session_id in sessions:
            raise HTTPException(
                status_code=400,
                detail="Session already exists"
            )

        interview_topics = select_interview_topics(
            request.candidate
        )

        sessions[session_id] = {
            "candidate": request.candidate,
            "curriculum": curriculum_data,
            "interview_topics": interview_topics,
            "messages": [],
            "question_count": 0
        }

        return {
            "reply": "Welcome. Let's begin your interview.",
            "done": False,
            "topics": interview_topics
        }

    # ---------------------------------------------
    # NORMAL INTERVIEW TURN
    # ---------------------------------------------

    if request.message is not None:

        if session_id not in sessions:
            raise HTTPException(
                status_code=404,
                detail="Session not found"
            )

        sessions[session_id]["messages"].append(
            {
                "role": "candidate",
                "content": request.message
            }
        )

        return {
            "reply": "Your answer has been recorded.",
            "done": False
        }

    # ---------------------------------------------
    # INVALID REQUEST
    # ---------------------------------------------

    raise HTTPException(
        status_code=400,
        detail="Provide either candidate or message"
    )