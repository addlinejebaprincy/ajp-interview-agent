import { useState } from 'react'
import CandidateSelector from './CandidateSelector'
import CustomCandidateForm from './CustomCandidateForm'
import { demoCandidate } from '../data/candidateData'

function LandingPage({ onCandidateSelected, initialView = 'home' }) {
  const [view, setView] = useState(initialView)

  return (
    <main className="landing-page">
      <header className="site-header page-shell">
        <a className="brand" href="#top" aria-label="AI Interview Agent home" onClick={() => setView('home')}>
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>AI Interview Agent</span>
        </a>
        <span className="demo-status"><i aria-hidden="true" /> Interactive demo</span>
      </header>

      {view === 'home' && (
        <div className="landing-content page-shell" id="top">
          <section className="hero-section" aria-labelledby="hero-title">
            <div className="cohort-badge">
              <span className="cohort-badge__spark" aria-hidden="true">✦</span>
              31-Day AI Cohort
            </div>
            <h1 id="hero-title">
              Interviews that follow<br />
              <span>how you learned.</span>
            </h1>
            <p>
              Adaptive technical interviews shaped by your learning journey—not a generic list of questions.
            </p>
            <div className="hero-proof" aria-label="Interview format">
              <span><strong>08</strong> adaptive questions</span>
              <span><strong>04</strong> curriculum areas</span>
              <span><strong>~12</strong> minutes</span>
            </div>
          </section>

          <section className="start-section" aria-labelledby="start-title">
            <div className="section-heading section-heading--compact">
              <span className="eyebrow">Choose your path</span>
              <h2 id="start-title">Start an interview</h2>
            </div>

            <button
              className="quick-demo-card"
              type="button"
              onClick={() => onCandidateSelected(demoCandidate)}
            >
              <span className="quick-demo-card__topline">
                <span className="recommended-pill">Recommended for judges</span>
                <span className="quick-demo-card__arrow" aria-hidden="true">↗</span>
              </span>
              <span className="quick-demo-card__icon" aria-hidden="true">▶</span>
              <span className="quick-demo-card__copy">
                <strong>Quick Demo</strong>
                <span>Instantly load {demoCandidate.name}’s official learning profile and experience the full demo flow.</span>
              </span>
              <span className="quick-demo-card__footer">
                Ready in one click <span aria-hidden="true">→</span>
              </span>
            </button>

            <div className="secondary-actions">
              <button className="option-card" type="button" onClick={() => setView('choose')}>
                <span className="option-card__icon option-card__icon--cyan" aria-hidden="true">⌘</span>
                <span>
                  <strong>Choose Candidate</strong>
                  <small>Browse all 20 official profiles</small>
                </span>
                <span aria-hidden="true">→</span>
              </button>
              <button className="option-card" type="button" onClick={() => setView('custom')}>
                <span className="option-card__icon option-card__icon--violet" aria-hidden="true">＋</span>
                <span>
                  <span className="option-card__title-line">
                    <strong>Custom Candidate</strong>
                    <em>Experimental</em>
                  </span>
                  <small>Create a custom learning profile</small>
                </span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {view === 'choose' && (
        <div className="page-shell inner-page">
          <CandidateSelector onSelect={onCandidateSelected} onBack={() => setView('home')} />
        </div>
      )}

      {view === 'custom' && (
        <div className="page-shell inner-page">
          <CustomCandidateForm onSubmit={onCandidateSelected} onBack={() => setView('home')} />
        </div>
      )}

      <footer className="landing-footer page-shell">
        <span>Built for thoughtful technical assessment</span>
        <span>Local demo · No data is sent</span>
      </footer>
    </main>
  )
}

export default LandingPage
