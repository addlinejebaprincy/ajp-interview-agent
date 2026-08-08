from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


app = FastAPI()


# Temporary in-memory storage for interview sessions
sessions = {}


class InterviewRequest(BaseModel):
    sessionId: str
    candidate: dict[str, Any] | None = None
    message: str | None = None


@app.post("/api/interview")
def interview(request: InterviewRequest):

    session_id = request.sessionId

    # START REQUEST
    if request.candidate is not None:

        if session_id in sessions:
            raise HTTPException(
                status_code=400,
                detail="Session already exists"
            )

        sessions[session_id] = {
            "candidate": request.candidate,
            "messages": [],
            "question_count": 0
        }

        return {
            "reply": "Welcome. Let's begin your interview.",
            "done": False
        }

    # NORMAL INTERVIEW TURN
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

    raise HTTPException(
        status_code=400,
        detail="Provide either candidate or message"
    )