import { mockCoverageDays, mockFeedback } from '../data/mockInterview'

function FeedbackPanel({ candidate, onTryAnother, onHome }) {
  return (
    <main className="feedback-page">
      <header className="site-header page-shell">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>AI Interview Agent</span>
        </div>
        <span className="step-indicator">Evaluation ready</span>
      </header>

      <div className="feedback-shell page-shell">
        <section className="completion-hero">
          <div className="completion-mark" aria-hidden="true">✓</div>
          <span className="eyebrow">Interview complete</span>
          <h1>Strong work, {candidate.name.split(' ')[0]}.</h1>
          <p>You completed all 8 adaptive questions. Here’s the signal we found across your responses.</p>
        </section>

        <section className="summary-card glass-panel" aria-labelledby="summary-title">
          <div className="score-ring" style={{ '--score': `${mockFeedback.score * 3.6}deg` }}>
            <div><strong>{mockFeedback.score}</strong><span>/ 100</span></div>
          </div>
          <div className="summary-copy">
            <span className="summary-label">Overall evaluation</span>
            <h2 id="summary-title">Interview-ready foundations</h2>
            <p>{mockFeedback.summary}</p>
          </div>
          <div className="competency-list">
            {mockFeedback.competencies.map((item) => (
              <div className="competency" key={item.label}>
                <div><span>{item.label}</span><strong>{item.value}</strong></div>
                <div className="competency-bar"><span style={{ width: `${item.value}%` }} /></div>
              </div>
            ))}
          </div>
        </section>

        <div className="feedback-grid">
          <section className="feedback-card glass-panel feedback-card--strengths">
            <div className="feedback-card__icon" aria-hidden="true">↗</div>
            <span className="eyebrow">What stood out</span>
            <h2>Strengths</h2>
            <ul>
              {mockFeedback.strengths.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section className="feedback-card glass-panel feedback-card--gaps">
            <div className="feedback-card__icon" aria-hidden="true">◎</div>
            <span className="eyebrow">Room to grow</span>
            <h2>Knowledge Gaps</h2>
            <ul>
              {mockFeedback.gaps.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
          <section className="feedback-card glass-panel feedback-card--next">
            <div className="feedback-card__icon" aria-hidden="true">→</div>
            <span className="eyebrow">Your action plan</span>
            <h2>Recommended Next Steps</h2>
            <ol>
              {mockFeedback.nextSteps.map((item, index) => (
                <li key={item}><span>0{index + 1}</span>{item}</li>
              ))}
            </ol>
          </section>
        </div>

        <section className="final-coverage glass-panel" aria-labelledby="final-coverage-title">
          <div>
            <span className="eyebrow">Curriculum map</span>
            <h2 id="final-coverage-title">Full coverage achieved</h2>
          </div>
          <div className="final-coverage__topics">
            {mockCoverageDays.map((topic) => (
              <span key={topic.day}><i aria-hidden="true">✓</i>Day {topic.day} · {topic.title}</span>
            ))}
          </div>
          <strong>4 / 4</strong>
        </section>

        <div className="feedback-actions">
          <button className="button button--primary" type="button" onClick={onTryAnother}>
            Try Another Candidate <span aria-hidden="true">→</span>
          </button>
          <button className="button button--secondary" type="button" onClick={onHome}>Back to Home</button>
        </div>
      </div>
    </main>
  )
}

export default FeedbackPanel
