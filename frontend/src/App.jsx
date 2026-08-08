import { useState } from 'react'
import './App.css'
import CandidatePreview from './components/CandidatePreview'
import FeedbackPanel from './components/FeedbackPanel'
import InterviewChat from './components/InterviewChat'
import LandingPage from './components/LandingPage'

function App() {
  const [screen, setScreen] = useState('landing')
  const [landingView, setLandingView] = useState('home')
  const [candidate, setCandidate] = useState(null)

  const selectCandidate = (selectedCandidate) => {
    setCandidate(selectedCandidate)
    setScreen('preview')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const returnHome = () => {
    setLandingView('home')
    setScreen('landing')
    setCandidate(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const tryAnother = () => {
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
        onStart={() => setScreen('interview')}
      />
    )
  }

  if (screen === 'interview' && candidate) {
    return (
      <InterviewChat
        candidate={candidate}
        onComplete={() => setScreen('feedback')}
        onExit={returnHome}
      />
    )
  }

  if (screen === 'feedback' && candidate) {
    return <FeedbackPanel candidate={candidate} onTryAnother={tryAnother} onHome={returnHome} />
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
