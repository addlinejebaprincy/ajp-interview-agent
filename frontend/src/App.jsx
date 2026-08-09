import { useEffect, useState } from 'react'
import './App.css'
import CandidatePreview from './components/CandidatePreview'
import FeedbackPanel from './components/FeedbackPanel'
import InterviewChat from './components/InterviewChat'
import LandingPage from './components/LandingPage'
import { toInterviewCandidate } from './data/candidateData'
import {
  startInterview,
  wakeInterviewService,
} from './services/interviewApi'

function App() {
  const [screen, setScreen] = useState('landing')
  const [landingView, setLandingView] = useState('home')
  const [candidate, setCandidate] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [initialQuestion, setInitialQuestion] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [coveredTopics, setCoveredTopics] = useState([])
  const [isStarting, setIsStarting] = useState(false)
  const [startError, setStartError] = useState('')
    useEffect(() => {
    wakeInterviewService()
  }, [])

  const selectCandidate = (selectedCandidate) => {
    setCandidate(selectedCandidate)
    setScreen('preview')
    setStartError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStartInterview = async () => {
    if (!candidate || isStarting) return

    setIsStarting(true)
    setStartError('')

    const newSessionId = crypto.randomUUID()

    try {
      const response = await startInterview(
        newSessionId,
        toInterviewCandidate(candidate)
      )

      setSessionId(newSessionId)
      setInitialQuestion({
        ...response.question,
        question: response.reply,
      })
      setScreen('interview')
    } catch (error) {
      setStartError(error.message)
    } finally {
      setIsStarting(false)
    }
  }

  const completeInterview = (finalFeedback, topics) => {
    setFeedback(finalFeedback)
    setCoveredTopics(topics)
    setScreen('feedback')
  }

  const resetInterview = () => {
    setSessionId(null)
    setInitialQuestion(null)
    setFeedback(null)
    setCoveredTopics([])
    setStartError('')
  }

  const returnHome = () => {
    resetInterview()
    setLandingView('home')
    setScreen('landing')
    setCandidate(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const tryAnother = () => {
    resetInterview()
    setLandingView('choose')
    setScreen('landing')
    setCandidate(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (screen === 'preview' && candidate) {
    return (
      <CandidatePreview
        candidate={candidate}
        onBack={returnHome}
        onStart={handleStartInterview}
        isStarting={isStarting}
        startError={startError}
      />
    )
  }

  if (
    screen === 'interview' &&
    candidate &&
    sessionId &&
    initialQuestion
  ) {
    return (
      <InterviewChat
        candidate={candidate}
        sessionId={sessionId}
        initialQuestion={initialQuestion}
        onComplete={completeInterview}
        onExit={returnHome}
      />
    )
  }

  if (screen === 'feedback' && candidate && feedback) {
    return (
      <FeedbackPanel
        candidate={candidate}
        feedback={feedback}
        coveredTopics={coveredTopics}
        onTryAnother={tryAnother}
        onHome={returnHome}
      />
    )
  }

  return (
    <LandingPage
      key={landingView}
      initialView={landingView}
      onCandidateSelected={selectCandidate}
    />
  )
}

export default App