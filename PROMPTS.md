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