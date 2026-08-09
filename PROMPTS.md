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

## Adaptive Follow-Up Questions

**Prompt:**

I have successfully integrated Groq and can generate the first personalized interview question using candidate data and selected curriculum topics.

Now help me make the interview adaptive.

Requirements:
- Store each candidate answer in the existing interview session.
- Use the previous interview questions and candidate answers as conversation context.
- Generate exactly one follow-up question at a time.
- If the candidate gives a weak or incomplete answer, ask a deeper question on the same topic.
- If the candidate demonstrates good understanding, allow the interviewer to move to another selected curriculum topic.
- Keep questions grounded only in the selected curriculum topics.
- Track the number of questions asked.
- Do not reveal reasoning or provide answers.
- Avoid unnecessary Groq API calls while testing.

**Implementation:**

- Added adaptive follow-up question generation.
- Passed session conversation history to Groq.
- Stored candidate answers and generated interviewer questions in the same session.
- Incremented the question count after each generated question.
- Verified that the second question adapts to the candidate's previous answer.

## Interview Coverage and Completion Logic

**Prompt:**

Help me make the adaptive interview satisfy the hackathon requirements while preserving follow-up behavior.

Requirements:
- Ask exactly 8 interview questions.
- Cover at least 4 different curriculum days.
- Allow adaptive follow-up questions based on the candidate's previous answer.
- Make Python control curriculum coverage instead of relying only on the LLM.
- Stop after Question 8 and do not generate Question 9.
- Return structured final feedback with summary, strengths, gaps, and next steps.
- Add a zero-Groq test so the control logic can be verified without consuming API quota.

**Implementation:**

- Added deterministic topic assignment for 8 questions across 4 curriculum days.
- Added curriculum-day tracking in the interview session.
- Added stopping logic after Question 8.
- Added structured final feedback generation.
- Added a mock test that verifies question count, curriculum coverage, and final response structure without calling Groq.

## Frontend UI Generation

**Tool:** OpenAI Codex

**Prompt:**

You are working on my hackathon project: ajp-interview-agent.

IMPORTANT SAFETY RULES:
- Work ONLY inside the `frontend/` folder.
- Do NOT modify anything inside `backend/`.
- Do NOT modify `backend/main.py`.
- Do NOT modify `.env`, `.env.example`, `requirements.txt`, `PROMPTS.md`, `README.md`, or the JSON files inside `data/`.
- Do NOT add any Groq API key or secret to the frontend.
- Do NOT call Groq directly from React.
- Do NOT change my existing backend API contract.
- For this task, build the frontend with mock/local data only.
- Do not connect to FastAPI yet.
- Do not make any real API requests yet.

PROJECT CONTEXT:
This project is an adaptive AI technical interviewer for a 31-day AI cohort.

The backend is already implemented separately and will later support:
- POST /api/interview
- 8 interview questions
- adaptive follow-up questions
- coverage of 4 curriculum days
- structured final feedback

The frontend should be designed to make the project very easy for online hackathon judges to test.

TECH:
- React + Vite
- Plain CSS is acceptable and preferred if it keeps the app lightweight.
- Avoid unnecessary large UI libraries.
- The app must be responsive and deployment-ready.

DESIGN DIRECTION:
Create a premium, modern AI-product interface.

Visual style:
- dark navy / charcoal background
- subtle violet and cyan accent glow
- glassmorphism-style cards
- professional, clean, futuristic look
- modern typography
- strong spacing and hierarchy
- smooth but restrained animations
- rounded cards and buttons
- subtle borders and shadows
- polished hover/focus states
- not overly cyberpunk or cluttered
- accessible contrast and readable text

RESPONSIVENESS:
The UI must work well on:
- mobile phones
- tablets
- laptops
- large desktops

Use a mobile-first responsive layout.
Do not allow horizontal scrolling.
Buttons and form fields must be touch-friendly.

BUILD THESE SCREENS / STATES:

1. LANDING / START SCREEN

Header / hero:
- App name: "AI Interview Agent"
- Subtitle similar to:
  "Adaptive technical interviews shaped by your learning journey."
- Small badge or label indicating:
  "31-Day AI Cohort"

Primary judge-friendly options:

A. "Quick Demo"
- This should be the most visually prominent option.
- Explain briefly that it instantly loads a pre-filled demo candidate.
- Clicking it should select a mock demo candidate locally and show the candidate preview.

B. "Choose Candidate"
- Opens/displays a polished candidate-selection view using local mock candidates.
- Include at least 4 mock candidate cards.
- Each candidate card should show:
  - name
  - role
  - years of experience
  - small learning-signal chips
- The candidate-selection UI should be easy to understand.

C. "Custom Candidate"
- Opens a custom candidate form.
- Fields:
  - name
  - job role
  - years of experience
  - education
- Also include a simple learning-history section where the user can choose at least 4 curriculum topics and indicate something like:
  - completed easily
  - needed multiple attempts
  - skipped
- This is frontend-only mock state for now.

2. CANDIDATE PREVIEW

After Quick Demo, Choose Candidate, or Custom Candidate:
show a polished preview card containing:
- candidate name
- role
- experience
- education if available
- learning signals
- selected / weak areas
- a clear "Start Interview" button

For this UI-only phase:
clicking "Start Interview" should NOT call the backend.
Instead, transition to the mock interview screen.

3. INTERVIEW SCREEN

Create a professional interview workspace.

Top area:
- candidate name
- small role label
- "Question X of 8"
- animated progress bar

Desktop:
- main interview panel
- optional narrow side panel showing 4 curriculum topics and coverage/progress

Mobile:
- single-column layout
- side information should collapse gracefully

Main interview content:
- interviewer label/avatar/icon area
- large question card
- answer textarea
- character-friendly sizing
- "Submit Answer" button

Use mock questions locally.

When Submit Answer is clicked:
- show the user's answer as a message
- show a subtle loading state such as:
  "Preparing your next adaptive question..."
- after a short local simulated delay, display the next mock question
- increment question count
- do not make any network/API calls

Create 8 mock questions total for UI demonstration.

The UI should visually suggest that follow-up questions are adaptive.

4. FINAL EVALUATION SCREEN

After mock Question 8:
show a polished completion/evaluation page.

Include:
- "Interview Complete"
- overall summary card
- Strengths card
- Knowledge Gaps card
- Recommended Next Steps card
- small curriculum coverage summary
- button: "Try Another Candidate"
- button: "Back to Home"

Use mock feedback data only.

COMPONENT STRUCTURE:
Keep the React code modular.

A suggested structure is:

frontend/src/
  App.jsx
  App.css
  main.jsx
  components/
    LandingPage.jsx
    CandidateSelector.jsx
    CandidateCard.jsx
    CandidatePreview.jsx
    CustomCandidateForm.jsx
    InterviewChat.jsx
    ProgressBar.jsx
    LoadingState.jsx
    FeedbackPanel.jsx
  data/
    mockCandidates.js
    mockInterview.js

You may adjust component names if needed, but keep the structure clean.

STATE / ARCHITECTURE:
- Use React state only.
- No backend calls in this task.
- No authentication.
- No global state library needed.
- Keep logic simple and readable.
- Avoid unnecessary dependencies.

ACCESSIBILITY:
- Use semantic HTML.
- Proper button labels.
- Visible keyboard focus states.
- Inputs must have labels.
- Good color contrast.
- Textareas/buttons usable via keyboard.

DEPLOYMENT READINESS:
- Do not use hardcoded absolute local filesystem paths.
- Do not depend on macOS-specific behavior.
- Keep all frontend assets inside `frontend/`.
- Ensure the production build works.

IMPORTANT:
Do not simply make a static mockup.
The UI states and navigation must actually work locally:
Landing → candidate choice → preview → mock interview → mock final feedback.

AFTER IMPLEMENTATION:
1. Run:
   npm run build
2. Fix all build errors if any.
3. Do not modify backend files to solve frontend problems.
4. Give me a concise summary of:
   - files created/changed
   - UI flow implemented
   - build result

**Result:**
- Created responsive React + Vite frontend.
- Added Quick Demo, Choose Candidate, and Custom Candidate flows.
- Added mock 8-question interview experience.
- Added final feedback dashboard.
- Backend was not modified during this UI generation task.


## Real Hackathon Data Integration

**Tool:** OpenAI Codex

**Prompt:**

Continue working on my existing `ajp-interview-agent` project.

The React frontend UI has already been built and is working well.

THIS IS A CAREFUL DATA-INTEGRATION/CLEANUP TASK.

Do NOT redesign the application.
Do NOT rebuild the frontend from scratch.
Do NOT change the existing visual style.
Do NOT connect the frontend to FastAPI yet.

==================================================
STRICT SAFETY RULES
==================================================

1. Preserve the existing React UI and interactions.
2. Work primarily inside `frontend/`.
3. You MAY READ:
   - data/candidates.json
   - data/curriculum.json

   These are the official hackathon datasets.

4. Do NOT modify:
   - backend/main.py
   - any file inside backend/
   - data/candidates.json
   - data/curriculum.json
   - .env
   - .env.example
   - requirements.txt
   - PROMPTS.md
   - README.md

5. Do NOT change the FastAPI API contract.
6. Do NOT make network/API requests.
7. Do NOT call FastAPI.
8. Do NOT call Groq.
9. Do NOT add API keys or secrets to React.
10. Do NOT remove currently working frontend functionality.
11. Do NOT introduce unnecessary dependencies.

If something in the real datasets differs from the existing mock-data structure, adapt the FRONTEND data mapping rather than modifying the official JSON files or backend.

==================================================
WHY THIS CHANGE IS NEEDED
==================================================

The first frontend version intentionally used mock candidates and mock curriculum topics while designing the UI.

Now replace those mock profiles/topics with information derived from the official hackathon datasets:

- `data/candidates.json`
  Contains 20 synthetic candidates and their learning journey / mission signals.

- `data/curriculum.json`
  Contains the official 31-day AI cohort curriculum.

The actual project concept is:

31-day curriculum
        +
candidate learning journey
        ↓
backend later selects 4 relevant curriculum days
        ↓
8-question adaptive interview
        ↓
structured final evaluation

The frontend should accurately represent this concept.

IMPORTANT:
31 refers to CURRICULUM DAYS.
It does NOT mean there are 31 candidates.

==================================================
1. QUICK DEMO
==================================================

Keep the existing Quick Demo experience and visual design.

However:

- Remove the invented/mock Quick Demo candidate.
- Use ONE REAL synthetic candidate from `data/candidates.json`.
- Choose a candidate whose mission history gives a useful mixture of learning signals so the adaptive-interview concept is easy to demonstrate.
- Do not invent candidate information.
- Use only fields actually supported by the provided candidate data.

Quick Demo should remain the easiest path for hackathon judges:

Quick Demo
→ real provided candidate automatically selected
→ candidate preview
→ Start Interview

For this task, Start Interview should STILL use the existing local/mock interview simulation.

DO NOT connect it to FastAPI yet.

==================================================
2. CHOOSE CANDIDATE
==================================================

Remove the four invented frontend candidates currently used for the candidate selector.

Instead, make the REAL candidates from:

`data/candidates.json`

available in the Choose Candidate interface.

There are 20 synthetic candidates.

All available candidates should be accessible to the user, but DO NOT display 20 huge cards at once if that damages the UI.

Preserve the current polished card design.

Implement a clean browsing experience such as:

- responsive candidate grid
- search by candidate name and/or role
- sensible pagination, "Show More", or another lightweight approach if necessary

Do NOT overengineer this.

Candidate cards should display only information actually available or safely derived from the provided candidate data, such as:

- name
- job role
- years of experience if present
- education if present
- concise learning signals derived from mission data

Do NOT invent professional details that are not present in the official candidate file.

Selecting a candidate should continue to open the existing Candidate Preview experience.

==================================================
3. CANDIDATE PREVIEW
==================================================

Preserve the existing Candidate Preview design.

Populate it from the selected REAL candidate.

Show useful information such as:

- candidate name
- role
- experience when available
- education when available
- learning journey signals
- areas requiring attention based on mission history

Use the actual candidate data.

Do not claim that the frontend has already selected the final 4 interview topics.

The real backend will perform that selection later.

The preview may summarize learning signals, but should not duplicate or replace backend interview logic.

==================================================
4. CUSTOM CANDIDATE
==================================================

Keep Custom Candidate as an OPTIONAL / BONUS feature.

Do NOT make it part of the core judge flow.

Update the UI label to make that clear, for example:

"Custom Candidate"
"Create a custom learning profile"

or a small:
"Experimental"
badge.

Preserve the current visual design.

The important change:

Custom Candidate learning history MUST map to the REAL 31-day curriculum from:

`data/curriculum.json`

Do not use invented curriculum topics.

Allow the user to select at least 4 real curriculum days/topics.

For each selected curriculum item, allow a simple learning status such as:

- Completed easily
- Needed multiple attempts
- Skipped

Convert this locally into a candidate-like structure compatible with the concept already used by the application.

This remains frontend-only for now.

Do NOT modify backend code to support it.

==================================================
5. CURRICULUM DATA
==================================================

Use the real curriculum titles/days from:

`data/curriculum.json`

Do NOT manually invent replacements.

Where curriculum information is displayed in the UI, clearly show things like:

Day 7
<actual curriculum title>

according to the real dataset.

Do not dump all 31 days onto the screen unnecessarily.

For Custom Candidate, use a responsive selector/search/dropdown/card interface that makes selecting curriculum topics manageable.

==================================================
6. MOCK INTERVIEW
==================================================

IMPORTANT:

Do NOT connect the frontend to the real backend in this task.

The existing local mock interview should continue working so we can safely test the complete UI without consuming Groq quota.

The flow should remain:

Landing
→ Quick Demo / Choose Candidate / Custom Candidate
→ Candidate Preview
→ Start Interview
→ local mock interview
→ Question 1–8
→ mock final feedback

Do NOT change the actual backend.

We will replace the mock interview with `/api/interview` in a separate task later.

==================================================
7. RESPONSIVENESS
==================================================

Preserve and improve responsiveness where necessary.

The application must work properly on:

- mobile phones
- tablets
- laptops
- desktop monitors

Requirements:

- no horizontal scrolling
- candidate cards wrap/reflow correctly
- candidate search works on mobile
- buttons remain touch-friendly
- forms fit narrow screens
- Custom Candidate curriculum selection is usable on mobile
- Candidate Preview becomes single-column where appropriate
- typography scales appropriately
- spacing remains visually balanced
- no text/card overflow
- existing dark premium design must remain consistent

Do not sacrifice desktop quality while fixing mobile layouts.

==================================================
8. PRESERVE THE EXISTING DESIGN
==================================================

The current frontend design is already approved.

Preserve:

- dark navy/charcoal theme
- violet/cyan accents
- glass-style cards
- current typography hierarchy
- rounded components
- subtle glow effects
- animations
- button styling
- candidate-card visual language
- overall page composition

Only make visual changes when necessary to accommodate the real data or improve responsive behavior.

DO NOT redesign the product.

==================================================
9. CODE QUALITY
==================================================

Keep components modular and readable.

If the existing frontend uses files such as:

- mockCandidates.js
- mockInterview.js

you may refactor the candidate-data layer appropriately.

However:

- keep mock interview data for now
- remove obsolete invented candidate data
- avoid duplicating the entire official datasets manually
- create small mapping/helper functions if necessary
- do not put huge data objects directly inside App.jsx
- do not introduce a state-management library

IMPORTANT:
Because the official JSON files are outside `frontend/`, choose a deployment-safe frontend approach for making the required candidate/curriculum data available at build/runtime WITHOUT modifying the original official JSON files.

A small frontend copy/generated representation or appropriate Vite-compatible approach is acceptable if necessary, but preserve the official source files untouched and clearly document what you chose in your final summary.

==================================================
10. VALIDATION
==================================================

After making the changes:

Run:

npm run build

Fix any FRONTEND build errors.

Do not modify the backend to fix frontend errors.

Also verify the existing UI flow still works:

Quick Demo
→ real candidate preview
→ mock interview

Choose Candidate
→ browse/search real candidates
→ select candidate
→ preview
→ mock interview

Custom Candidate
→ select real curriculum topics
→ create profile
→ preview
→ mock interview

==================================================
FINAL RESPONSE
==================================================

When finished, give me a concise report containing:

1. Files changed/created.
2. How official candidates.json is now represented in the frontend.
3. How official curriculum.json is now represented in the frontend.
4. Which real candidate was selected for Quick Demo and why.
5. How all 20 candidates are made accessible without clutter.
6. What changed in Custom Candidate.
7. Confirmation that no backend files were modified.
8. Confirmation that no API/Groq calls were added.
9. `npm run build` result.
10. Any issue you found that I should review manually.

Do not perform backend integration after finishing this task.
Stop after the frontend data integration and build verification.

**Result:**
- Replaced invented candidate profiles with official synthetic hackathon candidates.
- Integrated the official 31-day curriculum into the frontend data layer.
- Quick Demo now uses a provided candidate.
- Choose Candidate exposes the provided candidate dataset.
- Custom Candidate uses actual curriculum topics.
- Preserved responsive UI.
- Kept the interview mocked; no Groq/FastAPI integration was added during this step.

## Frontend and FastAPI Integration

### Prompt

Connect the existing React frontend to the existing FastAPI POST `/api/interview` endpoint without redesigning the UI. Use a frontend-generated `sessionId`, send the selected candidate when starting, send each candidate answer as `message`, display adaptive questions, and show structured final feedback using `summary`, `strengths`, `gaps`, and `next`. Add loading and retryable error states, keep the Groq key backend-only, and avoid unnecessary Groq calls during testing.

### Implementation

- Added a dedicated frontend API service.
- Converted frontend candidate data into the backend request format.
- Replaced local mock interview behavior with real API requests.
- Added question number, curriculum day, and topic metadata to backend responses.
- Connected structured backend feedback to the final feedback screen.
- Added loading, disabled-button, and retryable error states.
- Verified the complete 8-question flow with a temporary zero-Groq mock server.