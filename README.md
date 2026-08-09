# AJP Interview Agent

An adaptive AI technical interviewer built for **ABTalks Vibe Code Hackathon — Problem Statement 2: The Interview Agent**.

The application analyzes a candidate’s 31-day AI curriculum journey, selects four personalized learning areas, conducts an eight-question conversational interview, and generates structured final feedback.

## Live Demo

- **Application:** https://ajp-interview-agent.vercel.app

> The free Render backend may take up to a minute to wake after inactivity. The frontend starts waking it when the landing page opens.

## Core Features

- Eight-question conversational technical interview
- Covers four personalized curriculum days
- Two questions per selected curriculum topic
- Adaptive follow-ups based on previous answers
- Conversation history maintained through a session ID
- Real candidate and curriculum datasets
- Quick Demo, candidate selection, and custom candidate flows
- Structured feedback with:
  - Summary
  - Strengths
  - Knowledge gaps
  - Recommended next steps
- Responsive mobile, tablet, and desktop interface
- Loading and retryable error states

## Architecture

```text
React + Vite
    ↓ POST /api/interview
FastAPI
    ↓
Groq API — llama-3.3-70b-versatile
    ↓
FastAPI response
    ↓
React interview and feedback UI
```

The Groq API key remains on the backend and is never exposed to React.

## Technology Stack

### Frontend

- React
- Vite
- CSS
- Vercel

### Backend

- FastAPI
- Python
- Groq API
- Render

## API Contract

### Start an interview

```json
{
  "sessionId": "unique-session-id",
  "candidate": {
    "member": {},
    "missions": []
  }
}
```

### Submit an answer

```json
{
  "sessionId": "unique-session-id",
  "message": "Candidate answer"
}
```

### Question response

```json
{
  "reply": "Interview question",
  "done": false,
  "question": {
    "number": 1,
    "day": 12,
    "topic": "Prompt Engineering Fundamentals"
  }
}
```

### Final response

```json
{
  "reply": "Interview completed.",
  "done": true,
  "feedback": {
    "summary": "Overall evaluation",
    "strengths": [],
    "gaps": [],
    "next": []
  }
}
```

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/addlinejebaprincy/ajp-interview-agent.git
cd ajp-interview-agent
```

### 2. Start the backend

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_real_groq_api_key
```

Run FastAPI:

```bash
uvicorn backend.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Validation

Frontend checks:

```bash
cd frontend
npm run lint
npm run build
```

Zero-Groq backend test:

```bash
python test_interview_logic.py
```

The zero-Groq test confirms:

- Question count: 8
- Curriculum days covered: 4
- No Question 9
- Structured final feedback

## Deployment

- The FastAPI backend is deployed on Render.
- The React frontend is deployed on Vercel.
- `VITE_API_URL` connects Vercel to Render.
- `FRONTEND_URL` allows the Vercel production domain through FastAPI CORS.
- Render uses `/health` for health checks.

## Security

- The real Groq key is stored only in `.env` locally and as a Render environment variable.
- `.env` is excluded from Git.
- React never communicates directly with Groq.
- No secret API key is stored in the frontend or committed to GitHub.

## Current Limitation

Interview sessions are stored in backend memory. A session can be lost if the Render service restarts during an active interview. This is suitable for the hackathon prototype but can later be upgraded to Redis or a database.

## AI Assistance

AI-assisted development prompts and results are documented in [`PROMPTS.md`](PROMPTS.md).

## Author

**Addline Jeba Princy R A**

Solo participant — ABTalks Vibe Code Hackathon