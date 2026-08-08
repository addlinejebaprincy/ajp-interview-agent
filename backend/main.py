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

        sessions[session_id] = {
            "candidate": request.candidate,

            # The curriculum is now connected
            # to this interview session.
            "curriculum": curriculum_data,

            "messages": [],
            "question_count": 0
        }

        return {
            "reply": "Welcome. Let's begin your interview.",
            "done": False
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