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