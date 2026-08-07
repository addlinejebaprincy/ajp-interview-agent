from fastapi import FastAPI

app = FastAPI()


@app.post("/api/interview")
def interview():
    return {
        "reply": "Welcome. Let's begin your interview.",
        "done": False
    }