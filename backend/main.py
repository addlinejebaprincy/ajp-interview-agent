import json
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from groq import Groq
from pydantic import BaseModel


# -------------------------------------------------
# ENVIRONMENT VARIABLES
# -------------------------------------------------

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set")


# -------------------------------------------------
# GROQ CLIENT
# -------------------------------------------------

groq_client = Groq(
    api_key=GROQ_API_KEY
)


# -------------------------------------------------
# FASTAPI APP
# -------------------------------------------------

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
# GROQ QUESTION GENERATION
# -------------------------------------------------

def generate_first_question(
    candidate: dict[str, Any],
    interview_topics: list[dict[str, Any]]
):
    member = candidate.get("member", {})

    candidate_name = member.get("name", "Candidate")
    job_role = member.get("jobRole", "Unknown")

    topics_text = json.dumps(
        interview_topics,
        indent=2
    )

    system_prompt = """
You are an adaptive technical interviewer for a 31-day AI engineering cohort.

Your goal is to evaluate the candidate's real technical understanding.

Rules:
- Ask exactly ONE technical interview question.
- Base the question on the provided curriculum topics.
- Consider the candidate's learning performance.
- Keep the question clear and concise.
- Do not explain why you selected the question.
- Do not provide the answer.
- Do not give feedback yet.
- Do not ask multiple questions at once.
"""

    user_prompt = f"""
Candidate: {candidate_name}
Role: {job_role}

Selected curriculum topics:
{topics_text}

Ask the first technical interview question.
"""

    completion = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        temperature=0.6
    )

    return completion.choices[0].message.content


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

        if len(interview_topics) < 4:
            raise HTTPException(
                status_code=400,
                detail="Candidate does not have enough curriculum topics"
            )

        first_question = generate_first_question(
            request.candidate,
            interview_topics
        )

        sessions[session_id] = {
            "candidate": request.candidate,
            "curriculum": curriculum_data,
            "interview_topics": interview_topics,
            "messages": [
                {
                    "role": "interviewer",
                    "content": first_question
                }
            ],
            "question_count": 1
        }

        return {
            "reply": first_question,
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