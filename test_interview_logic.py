from backend import main


# -------------------------------------------------
# MOCK AI FUNCTIONS
# These replace Groq ONLY inside this test process.
# No Groq API calls are made.
# -------------------------------------------------

def mock_first_question(candidate, target_topic):
    return f"Mock Question 1 for Day {target_topic['day']}"


def mock_follow_up_question(
    candidate,
    target_topic,
    messages,
    question_count
):
    next_number = question_count + 1

    return (
        f"Mock Question {next_number} "
        f"for Day {target_topic['day']}"
    )


def mock_final_feedback(
    candidate,
    interview_topics,
    messages
):
    return {
        "summary": "Mock interview completed successfully.",
        "strengths": ["Mock strength"],
        "gaps": ["Mock gap"],
        "next": ["Mock next step"]
    }


# Replace real Groq functions with fake functions
main.generate_first_question = mock_first_question
main.generate_follow_up_question = mock_follow_up_question
main.generate_final_feedback = mock_final_feedback


# -------------------------------------------------
# TEST CANDIDATE
# -------------------------------------------------

candidate = {
    "member": {
        "id": "TEST-001",
        "name": "Test Candidate",
        "jobRole": "AI Engineer"
    },
    "missions": [
        {
            "day": 7,
            "title": "Embeddings Explained",
            "passed": True,
            "attempts": 1
        },
        {
            "day": 12,
            "title": "Prompt Engineering Fundamentals",
            "passed": True,
            "attempts": 4
        },
        {
            "day": 22,
            "title": "Multi-Agent Orchestration",
            "passed": True,
            "attempts": 2
        },
        {
            "day": 28,
            "title": "Docker & Kubernetes Deployment",
            "passed": True,
            "attempts": 3
        }
    ]
}


session_id = "mock-test-1"


# -------------------------------------------------
# START INTERVIEW
# -------------------------------------------------

start_response = main.interview(
    main.InterviewRequest(
        sessionId=session_id,
        candidate=candidate
    )
)

print("\nSTART:")
print(start_response)


# -------------------------------------------------
# ANSWER ALL 8 QUESTIONS
# -------------------------------------------------

for answer_number in range(1, 9):

    response = main.interview(
        main.InterviewRequest(
            sessionId=session_id,
            message=f"Mock answer {answer_number}"
        )
    )

    print(f"\nAFTER ANSWER {answer_number}:")
    print(response)


# -------------------------------------------------
# CHECK FINAL SESSION STATE
# -------------------------------------------------

session = main.sessions[session_id]

print("\nFINAL CHECK:")
print("Question count:", session["question_count"])
print("Covered days:", session["covered_days"])
print("Number of covered days:", len(session["covered_days"]))