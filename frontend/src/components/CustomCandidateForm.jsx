import { useMemo, useState } from 'react'
import {
  createCustomCandidate,
  curriculumDays,
  learningStatuses,
} from '../data/candidateData'

const VISIBLE_CURRICULUM_COUNT = 8
const customStatuses = Object.entries(learningStatuses).filter(([value]) => value !== 'failed')

function CustomCandidateForm({ onSubmit, onBack }) {
  const [form, setForm] = useState({
    name: '',
    role: '',
    experience: '',
    education: '',
  })
  const [history, setHistory] = useState({})
  const [curriculumQuery, setCurriculumQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(VISIBLE_CURRICULUM_COUNT)
  const [selectionError, setSelectionError] = useState('')

  const selectedDays = curriculumDays.filter((item) => history[item.day])
  const filteredCurriculum = useMemo(() => {
    const query = curriculumQuery.trim().toLowerCase()
    if (!query) return curriculumDays
    return curriculumDays.filter((item) =>
      `day ${item.day} ${item.title} ${item.type}`.toLowerCase().includes(query),
    )
  }, [curriculumQuery])
  const visibleCurriculum = filteredCurriculum.slice(0, visibleCount)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const toggleCurriculumDay = (day) => {
    setHistory((current) => {
      const next = { ...current }
      if (next[day]) delete next[day]
      else next[day] = 'easy'
      return next
    })
    setSelectionError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (selectedDays.length < 4) {
      setSelectionError('Select at least 4 curriculum days to create a learning profile.')
      return
    }

    onSubmit(createCustomCandidate({ form, selectedHistory: history }))
  }

  return (
    <section className="selection-view custom-view" aria-labelledby="custom-candidate-title">
      <button className="text-button back-button" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span> Back to options
      </button>
      <div className="section-heading">
        <span className="eyebrow">Experimental · Create a profile</span>
        <h2 id="custom-candidate-title">Tell us about the candidate</h2>
        <p>Build an optional local profile using real days from the official 31-day cohort curriculum.</p>
      </div>

      <form className="custom-form glass-panel" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Candidate details</legend>
          <div className="form-grid">
            <label>
              <span>Name</span>
              <input name="name" value={form.name} onChange={updateField} placeholder="e.g. Priya Sharma" required />
            </label>
            <label>
              <span>Job role</span>
              <input name="role" value={form.role} onChange={updateField} placeholder="e.g. AI Engineer" required />
            </label>
            <label>
              <span>Years of experience</span>
              <input
                name="experience"
                type="number"
                inputMode="numeric"
                min="0"
                max="40"
                value={form.experience}
                onChange={updateField}
                placeholder="3"
                required
              />
            </label>
            <label>
              <span>Education</span>
              <input
                name="education"
                value={form.education}
                onChange={updateField}
                placeholder="e.g. B.Tech in Computer Science"
                required
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="learning-history">
          <legend>Learning history</legend>
          <div className="curriculum-heading-row">
            <p className="field-help">Select at least 4 real curriculum days, then describe the learning outcome.</p>
            <span className={`selection-count${selectedDays.length >= 4 ? ' is-ready' : ''}`}>
              {selectedDays.length} selected
            </span>
          </div>

          <label className="candidate-search curriculum-search">
            <span className="sr-only">Search the 31-day curriculum</span>
            <span className="candidate-search__icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              value={curriculumQuery}
              onChange={(event) => {
                setCurriculumQuery(event.target.value)
                setVisibleCount(VISIBLE_CURRICULUM_COUNT)
              }}
              placeholder="Search day, topic, or activity type..."
            />
          </label>

          <div className="curriculum-picker" aria-label="Official curriculum days">
            {visibleCurriculum.map((item) => {
              const isSelected = Boolean(history[item.day])
              return (
                <label className={`curriculum-option${isSelected ? ' is-selected' : ''}`} key={item.day}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCurriculumDay(item.day)}
                  />
                  <span className="curriculum-option__day">Day {item.day}</span>
                  <span className="curriculum-option__copy">
                    <strong>{item.title}</strong>
                    <small>{item.type.replace('_', ' ')}</small>
                  </span>
                  <span className="curriculum-option__check" aria-hidden="true">✓</span>
                </label>
              )
            })}
          </div>

          {visibleCurriculum.length < filteredCurriculum.length && (
            <button
              className="text-button curriculum-more"
              type="button"
              onClick={() => setVisibleCount((count) => count + VISIBLE_CURRICULUM_COUNT)}
            >
              Show more curriculum days <span aria-hidden="true">↓</span>
            </button>
          )}

          {selectedDays.length > 0 && (
            <div className="selected-history">
              <div className="selected-history__heading">
                <strong>Selected learning signals</strong>
                <span>Set an outcome for each day</span>
              </div>
              <div className="history-list">
                {selectedDays.map((item) => (
                  <div className="history-row" key={item.day}>
                    <span className="topic-index" aria-hidden="true">Day {item.day}</span>
                    <label htmlFor={`history-${item.day}`}>{item.title}</label>
                    <select
                      id={`history-${item.day}`}
                      value={history[item.day]}
                      onChange={(event) =>
                        setHistory((current) => ({ ...current, [item.day]: event.target.value }))
                      }
                    >
                      {customStatuses.map(([value, status]) => (
                        <option value={value} key={value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectionError && <p className="form-error" role="alert">{selectionError}</p>}
        </fieldset>

        <div className="form-actions">
          <span className="form-actions__hint">Optional frontend-only profile</span>
          <button className="button button--primary" type="submit">
            Preview candidate <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </section>
  )
}

export default CustomCandidateForm
