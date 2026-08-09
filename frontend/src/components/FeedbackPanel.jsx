function FeedbackPanel({
  candidate,
  feedback,
  coveredTopics,
  onTryAnother,
  onHome,
}) {
  return (
    <main className="feedback-page">
      <header className="site-header page-shell">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>AI Interview Agent</span>
        </div>
        <span className="step-indicator">Evaluation ready</span>
      </header>

      <div className="feedback-shell page-shell">
        <section className="completion-hero">
          <div className="completion-mark" aria-hidden="true">
            ✓
          </div>
          <span className="eyebrow">Interview complete</span>
          <h1>Strong work, {candidate.name.split(' ')[0]}.</h1>
          <p>
            You completed all 8 adaptive questions. Here’s the
            feedback based on your responses.
          </p>
        </section>

        <section
          className="summary-card glass-panel"
          aria-labelledby="summary-title"
        >
          <div
            className="score-ring"
            style={{ '--score': '360deg' }}
          >
            <div>
              <strong>8</strong>
              <span>/ 8</span>
            </div>
          </div>

          <div className="summary-copy">
            <span className="summary-label">
              Overall evaluation
            </span>
            <h2 id="summary-title">Interview completed</h2>
            <p>{feedback.summary}</p>
          </div>
        </section>

        <div className="feedback-grid">
          <section className="feedback-card glass-panel feedback-card--strengths">
            <div
              className="feedback-card__icon"
              aria-hidden="true"
            >
              ↗
            </div>
            <span className="eyebrow">What stood out</span>
            <h2>Strengths</h2>
            <ul>
              {feedback.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="feedback-card glass-panel feedback-card--gaps">
            <div
              className="feedback-card__icon"
              aria-hidden="true"
            >
              ◎
            </div>
            <span className="eyebrow">Room to grow</span>
            <h2>Knowledge Gaps</h2>
            <ul>
              {feedback.gaps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="feedback-card glass-panel feedback-card--next">
            <div
              className="feedback-card__icon"
              aria-hidden="true"
            >
              →
            </div>
            <span className="eyebrow">Your action plan</span>
            <h2>Recommended Next Steps</h2>
            <ol>
              {feedback.next.map((item, index) => (
                <li key={item}>
                  <span>0{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section
          className="final-coverage glass-panel"
          aria-labelledby="final-coverage-title"
        >
          <div>
            <span className="eyebrow">Curriculum map</span>
            <h2 id="final-coverage-title">
              Full coverage achieved
            </h2>
          </div>

          <div className="final-coverage__topics">
            {coveredTopics.map((topic) => (
              <span key={topic.day}>
                <i aria-hidden="true">✓</i>
                Day {topic.day} · {topic.title}
              </span>
            ))}
          </div>

          <strong>{coveredTopics.length} / 4</strong>
        </section>

        <div className="feedback-actions">
          <button
            className="button button--primary"
            type="button"
            onClick={onTryAnother}
          >
            Try Another Candidate{' '}
            <span aria-hidden="true">→</span>
          </button>

          <button
            className="button button--secondary"
            type="button"
            onClick={onHome}
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  )
}

export default FeedbackPanel