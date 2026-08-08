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

def get_topic_for_question(
    interview_topics: list[dict[str, Any]],
    question_number: int
):
    topic_index = (question_number - 1) // 2

    return interview_topics[topic_index]


# -------------------------------------------------
# GROQ QUESTION GENERATION
# -------------------------------------------------

def generate_first_question(
    candidate: dict[str, Any],
    target_topic: dict[str, Any]
):
    member = candidate.get("member", {})

    candidate_name = member.get("name", "Candidate")
    job_role = member.get("jobRole", "Unknown")

    topic_text = json.dumps(
        target_topic,
        indent=2
    )

    system_prompt = """
You are an adaptive technical interviewer for a 31-day AI engineering cohort.

Ask exactly ONE technical interview question.

Rules:
- Ask only about the provided curriculum topic.
- Consider the candidate's learning performance.
- Keep the question clear and concise.
- Do not provide the answer.
- Do not give feedback.
- Do not explain your reasoning.
- Return only the question text.
"""

    user_prompt = f"""
Candidate: {candidate_name}
Role: {job_role}

Target curriculum topic:
{topic_text}

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

def generate_follow_up_question(
    candidate: dict[str, Any],
    target_topic: dict[str, Any],
    messages: list[dict[str, Any]],
    question_count: int
):
    member = candidate.get("member", {})

    candidate_name = member.get("name", "Candidate")
    job_role = member.get("jobRole", "Unknown")

    topic_text = json.dumps(
        target_topic,
        indent=2
    )

    history_text = json.dumps(
        messages,
        indent=2
    )

    next_question_number = question_count + 1

    system_prompt = """
You are an adaptive technical interviewer for a 31-day AI engineering cohort.

Ask exactly ONE technical interview question.

Use the candidate's previous answer to adapt the question.

Rules:
- Ask only about the provided target curriculum topic.
- If this topic was used in the previous question, ask an adaptive follow-up based on the candidate's answer.
- Probe deeper when the answer is incomplete or shallow.
- Adjust difficulty based on the candidate's demonstrated understanding.
- Do not provide the answer.
- Do not give final feedback.
- Do not explain your reasoning.
- Return only the question text.
"""

    user_prompt = f"""
Candidate: {candidate_name}
Role: {job_role}

Target curriculum topic:
{topic_text}

Interview history:
{history_text}

Next question number: {next_question_number}

Generate the next adaptive technical interview question.
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

def generate_final_feedback(
    candidate: dict[str, Any],
    interview_topics: list[dict[str, Any]],
    messages: list[dict[str, Any]]
):
    member = candidate.get("member", {})

    candidate_name = member.get("name", "Candidate")
    job_role = member.get("jobRole", "Unknown")

    topics_text = json.dumps(
        interview_topics,
        indent=2
    )

    history_text = json.dumps(
        messages,
        indent=2
    )

    system_prompt = """
You are evaluating a completed technical interview for a
31-day AI engineering cohort.

Evaluate the candidate only from:
- the provided curriculum topics
- the interview questions
- the candidate's answers

Return valid JSON only.

The JSON must have exactly this structure:

{
  "summary": "short overall evaluation",
  "strengths": ["strength 1", "strength 2"],
  "gaps": ["gap 1", "gap 2"],
  "next": ["next step 1", "next step 2"]
}

Rules:
- Be specific and constructive.
- Base strengths and gaps on evidence from the interview.
- Do not invent skills that were not discussed.
- Keep each list concise.
- Do not include markdown.
- Do not include text outside the JSON object.
"""

    user_prompt = f"""
Candidate: {candidate_name}
Role: {job_role}

Interview curriculum topics:
{topics_text}

Complete interview history:
{history_text}

Generate the final structured interview evaluation.
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
        response_format={
            "type": "json_object"
        },
        temperature=0.3
    )

    feedback_text = completion.choices[0].message.content

    return json.loads(feedback_text)


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
        first_topic = get_topic_for_question(
            interview_topics,
            1
    )

        first_question = generate_first_question(
            request.candidate,
            first_topic
       )

        sessions[session_id] = {
            "candidate": request.candidate,
            "curriculum": curriculum_data,
            "interview_topics": interview_topics,
            "covered_days": [first_topic["day"]],
            "messages": [
                {
                    "role": "interviewer",
                    "content": first_question,
                    "day": first_topic["day"]
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

        session = sessions[session_id]

        # Store the candidate's answer
        session["messages"].append(
            {
                "role": "candidate",
                "content": request.message
            }
        )

        # Question 8 has already been asked.
        # Save the answer, then stop generating new questions.
        if session["question_count"] >= 8:

            feedback = generate_final_feedback(
                session["candidate"],
                session["interview_topics"],
                session["messages"]
           )

            return {
                "reply": "Interview completed.",
                "done": True,
                "feedback": feedback
          }

        # Decide which curriculum topic the next question must cover
        next_question_number = session["question_count"] + 1

        target_topic = get_topic_for_question(
            session["interview_topics"],
            next_question_number
        )

        # Generate the next adaptive question
        follow_up_question = generate_follow_up_question(
            session["candidate"],
            target_topic,
            session["messages"],
            session["question_count"]
        )

        # Store the interviewer question
        session["messages"].append(
            {
                "role": "interviewer",
                "content": follow_up_question,
                "day": target_topic["day"]
            }
        )

        # Track which curriculum days have been covered
        if target_topic["day"] not in session["covered_days"]:
            session["covered_days"].append(
                target_topic["day"]
            )

        # Increase question count
        session["question_count"] += 1

        return {
            "reply": follow_up_question,
            "done": False
        }

    # ---------------------------------------------
    # INVALID REQUEST
    # ---------------------------------------------

    raise HTTPException(
        status_code=400,
        detail="Provide either candidate or message"
    )