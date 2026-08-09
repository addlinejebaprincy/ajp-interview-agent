const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function sendInterviewRequest(body) {
  const response = await fetch(`${API_BASE_URL}/api/interview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.detail || 'Unable to connect to the interview service.'
    )
  }

  return data
}

export function startInterview(sessionId, candidate) {
  return sendInterviewRequest({
    sessionId,
    candidate,
  })
}

export function submitInterviewAnswer(sessionId, message) {
  return sendInterviewRequest({
    sessionId,
    message,
  })
}