# AI Usage Log

This file documents the AI-assisted development process for the AJP Interview Agent.

## Day 1 — Project Planning and Setup

### Tools Used
- ChatGPT

### Planning
- Reviewed Problem Statement 2: The Interview Agent.
- Reviewed the provided Technical Specification.
- Reviewed the provided 31-day curriculum JSON.
- Reviewed the provided candidate profiles.
- Chose the initial architecture:
  - React + Vite frontend
  - FastAPI backend
  - Groq for LLM inference
  - Breeth for interview memory
- Planned the required `POST /api/interview` endpoint.

### Initial Setup Prompt

> Help me set up the initial repository structure for my AI Interview Agent hackathon project. The application must expose `POST /api/interview`, use the supplied curriculum and candidate profile data, maintain interview sessions, conduct adaptive technical interviews, and produce structured feedback. 

## Session and Data Integration

**Prompt:**  
Help me implement session handling for the interview API and connect the provided candidate and curriculum JSON data. Explain the implementation in a beginner-friendly way and keep the architecture simple for the hackathon.

**AI Assistance:**  
- Added Pydantic request validation for `sessionId`, `candidate`, and `message`.
- Implemented temporary in-memory interview session storage.
- Added handling for interview start requests and normal answer turns.
- Added JSON loading for `candidates.json` and `curriculum.json`.
- Connected curriculum data to interview session state.
- Added basic error handling for invalid or missing sessions.

**Implementation Decision:**  
Used simple in-memory session storage for the MVP. Persistent memory and Breeth integration are deferred until the core interview flow is working. 

## Candidate-Based Interview Personalization

**Prompt:**  
Help me use candidate mission history and the 31-day curriculum to select personalized interview topics.

**AI Assistance:**  
- Inspected the candidate mission and curriculum data structure.
- Added logic to prioritize skipped topics and topics requiring more attempts.
- Mapped candidate mission days to the full curriculum objectives.
- Selected four curriculum days for the interview.

**Implementation Decision:**  
The MVP prioritizes weaker or skipped areas so candidates receive different interview topics based on their cohort performance.

## Groq API Integration

**Prompt:**

I have completed the FastAPI interview endpoint, session handling, and candidate-based topic selection using the provided curriculum and candidate data.

Now help me integrate the Groq API into my interview agent.

Requirements:
- Load the Groq API key securely from a `.env` file.
- Do not hardcode or expose the API key.
- Use the selected candidate-specific curriculum topics as context.
- Generate the first technical interview question dynamically using Groq.
- Ask only one question at a time.
- Do not reveal the AI's reasoning or provide the answer.
- Store the generated question in the candidate's interview session.
- Update the question count when a question is generated.
- Keep the implementation simple because this is a hackathon MVP.
- Explain the important code changes so I can understand the implementation.
- Avoid unnecessary Groq API calls while testing because I am using the free tier.

**Implementation:**

- Added the Groq Python SDK.
- Added `python-dotenv` for environment variable loading.
- Loaded `GROQ_API_KEY` securely from `.env`.
- Created a reusable Groq client.
- Added a function to generate the first personalized interview question.
- Passed candidate information and selected curriculum topics to the LLM.
- Stored the generated interviewer question in session history.
- Initialized the question count to 1 after the first question.
- Updated the interviewer prompt to return only the question without exposing model reasoning.