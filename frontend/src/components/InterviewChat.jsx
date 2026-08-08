import { useEffect, useRef, useState } from 'react'
import { mockCoverageDays, mockQuestions } from '../data/mockInterview'
import LoadingState from './LoadingState'
import ProgressBar from './ProgressBar'

function InterviewChat({ candidate, onComplete, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [transcript, setTranscript] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const timerRef = useRef(null)
  const answerRef = useRef(null)
  const currentQuestion = mockQuestions[currentIndex]

  useEffect(() => () => clearTimeout(timerRef.current), [])

  useEffect(() => {
    if (!isLoading) answerRef.current?.focus()
  }, [currentIndex, isLoading])

  const submitAnswer = (event) => {
    event.preventDefault()
    const cleanAnswer = answer.trim()
    if (!cleanAnswer || isLoading) return

    const nextTranscript = [
      ...transcript,
      { question: currentQuestion.question, day: currentQuestion.day, topic: currentQuestion.topic, answer: cleanAnswer },
    ]
    setTranscript(nextTranscript)
    setAnswer('')
    setIsLoading(true)

    timerRef.current = setTimeout(() => {
      if (currentIndex === mockQuestions.length - 1) {
        onComplete(nextTranscript)
        return
      }
      setCurrentIndex((index) => index + 1)
      setIsLoading(false)
    }, 900)
  }

  const handleKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      submitAnswer(event)
    }
  }

  return (
    <main className="interview-page">
      <header className="interview-header">
        <div className="interview-header__inner page-shell">
          <div className="brand brand--compact">
            <span className="brand-mark" aria-hidden="true"><span /></span>
            <span>AI Interview Agent</span>
          </div>
          <div className="interview-candidate">
            <span className={`avatar avatar--small avatar--${candidate.accent}`} aria-hidden="true">{candidate.initials}</span>
            <span><strong>{candidate.name}</strong><small>{candidate.role}</small></span>
          </div>
          <button className="exit-button" type="button" onClick={onExit}>Exit demo</button>
        </div>
      </header>

      <div className="interview-progress page-shell">
        <ProgressBar current={currentIndex + 1} total={mockQuestions.length} />
      </div>

      <div className="interview-layout page-shell">
        <section className="interview-main" aria-labelledby="current-question-title">
          <div className="interviewer-heading">
            <span className="ai-avatar" aria-hidden="true"><i /></span>
            <div>
              <strong>Ari</strong>
              <span><i aria-hidden="true" /> AI interviewer · Listening</span>
            </div>
          </div>

          {transcript.length > 0 && (
            <div className="conversation-history" aria-label="Recent responses">
              {transcript.slice(-2).map((entry, index) => (
                <details className="answer-message" key={`${entry.topic}-${transcript.length - index}`}>
                  <summary>
                    <span>Your answer · {entry.topic}</span>
                    <span aria-hidden="true">⌄</span>
                  </summary>
                  <p>{entry.answer}</p>
                </details>
              ))}
            </div>
          )}

          {isLoading ? (
            <LoadingState isComplete={currentIndex === mockQuestions.length - 1} />
          ) : (
            <div className="question-stage" key={currentQuestion.id}>
              <div className="question-card glass-panel">
                <div className="question-tags">
                  <span>Day {currentQuestion.day} · {currentQuestion.topic}</span>
                  <span>{currentQuestion.difficulty}</span>
                </div>
                <h1 id="current-question-title">{currentQuestion.question}</h1>
                <div className="adaptive-cue">
                  <span aria-hidden="true">✦</span>
                  {currentQuestion.adaptiveCue}
                </div>
              </div>

              <form className="answer-form" onSubmit={submitAnswer}>
                <label htmlFor="interview-answer">Your answer</label>
                <div className="textarea-wrap">
                  <textarea
                    id="interview-answer"
                    ref={answerRef}
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Think aloud. Explain your approach, trade-offs, and what you would verify..."
                    rows="6"
                    required
                  />
                  <span className="character-count">{answer.length} characters</span>
                </div>
                <div className="answer-actions">
                  <span><kbd>⌘</kbd> + <kbd>Enter</kbd> to submit</span>
                  <button className="button button--primary" type="submit" disabled={!answer.trim()}>
                    Submit Answer <span aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>

        <aside className="coverage-panel glass-panel" aria-labelledby="coverage-title">
          <div className="coverage-panel__heading">
            <span className="eyebrow">Live map</span>
            <h2 id="coverage-title">Curriculum coverage</h2>
          </div>
          <div className="coverage-list">
            {mockCoverageDays.map((topic) => {
              const answered = transcript.filter((entry) => entry.day === topic.day).length
              const isActive = !isLoading && currentQuestion.day === topic.day
              const isComplete = answered === 2
              return (
                <div className={`coverage-item${isActive ? ' is-active' : ''}${isComplete ? ' is-complete' : ''}`} key={topic.day}>
                  <div className="coverage-item__top">
                    <span className="coverage-number">Day {topic.day}</span>
                    <span className="coverage-name">{topic.title}</span>
                    <span className="coverage-state">{isComplete ? 'Done' : isActive ? 'Active' : `${answered}/2`}</span>
                  </div>
                  <div className="mini-progress"><span style={{ width: `${answered * 50}%` }} /></div>
                </div>
              )
            })}
          </div>
          <div className="coverage-insight">
            <span aria-hidden="true">◎</span>
            <p><strong>Local simulation</strong> These 4 official curriculum days keep the full UI testable without calling the backend.</p>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default InterviewChat
