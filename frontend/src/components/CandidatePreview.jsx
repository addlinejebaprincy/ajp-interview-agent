import { learningStatuses } from '../data/candidateData'

function CandidatePreview({ candidate, onStart, onBack, isStarting, startError, }) {
  const attentionAreas = candidate.attentionAreas.slice(0, 3)

  return (
    <main className="preview-page">
      <header className="site-header page-shell">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>AI Interview Agent</span>
        </div>
        <span className="step-indicator">Candidate preview</span>
      </header>

      <div className="preview-layout page-shell">
        <button className="text-button back-button preview-back" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span> Change candidate
        </button>

        <section className="preview-intro">
          <span className="eyebrow">Profile ready</span>
          <h1>Meet your candidate.</h1>
          <p>
            Review the learning-journey signals recorded across the 31-day cohort before starting the local interview demo.
          </p>
          <div className="preview-note">
            <span className="preview-note__icon" aria-hidden="true">✦</span>
            <div>
              <strong>Curriculum-grounded signals</strong>
              <p>The real backend will later select the final 4 interview days. This preview summarizes mission history only.</p>
            </div>
          </div>
        </section>

        <section className="profile-card glass-panel" aria-labelledby="candidate-name">
          <div className="profile-card__header">
            <span className={`avatar avatar--large avatar--${candidate.accent}`} aria-hidden="true">
              {candidate.initials}
            </span>
            <div>
              <span className="profile-ready">
                <i aria-hidden="true" /> {candidate.source === 'official' ? 'Official synthetic profile' : 'Custom local profile'}
              </span>
              <h2 id="candidate-name">{candidate.name}</h2>
              <p>{candidate.role}</p>
            </div>
          </div>

          <dl className="profile-facts">
            <div>
              <dt>Experience</dt>
              <dd>{candidate.experience} {candidate.experience === 1 ? 'year' : 'years'}</dd>
            </div>
            <div>
              <dt>Education</dt>
              <dd>{candidate.education || 'Not provided'}</dd>
            </div>
          </dl>

          {candidate.journeyStats && (
            <div className="journey-metrics" aria-label="Cohort journey summary">
              <div><strong>{candidate.journeyStats.commitDays}</strong><span>Commit days</span></div>
              <div><strong>{candidate.journeyStats.missionsCompleted}</strong><span>Missions completed</span></div>
              <div><strong>{candidate.journeyStats.missionsFirstTry}</strong><span>First try</span></div>
            </div>
          )}

          <div className="profile-signals">
            <div className="profile-section-title">
              <h3>Learning journey signals</h3>
              <span>{candidate.missionCount} recorded {candidate.missionCount === 1 ? 'mission' : 'missions'}</span>
            </div>
            <div className="signal-list">
              {candidate.signals.map((signal) => {
                const status = learningStatuses[signal.status]
                return (
                  <div className="signal-row" key={signal.day}>
                    <span className={`signal-dot signal-dot--${status.tone}`} aria-hidden="true" />
                    <span>{signal.topic}</span>
                    <span className={`signal-label signal-label--${status.tone}`}>{status.shortLabel}</span>
                  </div>
                )
              })}
            </div>
            {candidate.allSignals.length > candidate.signals.length && (
              <p className="representative-note">Showing representative mission signals from the provided learning history.</p>
            )}
          </div>

          {attentionAreas.length > 0 && (
            <div className="focus-callout">
              <span aria-hidden="true">◎</span>
              <p>
                <strong>Areas to review</strong>{' '}
                {attentionAreas.map((item) => `Day ${item.day}: ${item.title}`).join(' · ')}
              </p>
            </div>
          )}

          <button
            className="button button--primary button--full"
            type="button"
            onClick={onStart}
            disabled={isStarting}
          >
            {isStarting ? 'Preparing Interview...' : 'Start Interview'}
            {!isStarting && <span aria-hidden="true"> →</span>}
          </button>

          {startError ? (
            <p className="local-note" role="alert">
              {startError} Check that FastAPI is running, then try again.
            </p>
          ) : (
            <p className="local-note">
              AI-powered interview · Answers are sent securely to the backend
            </p>
          )}
        </section>
      </div>
    </main>
  )
}

export default CandidatePreview
