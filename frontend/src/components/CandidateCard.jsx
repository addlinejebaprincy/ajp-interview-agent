function CandidateCard({ candidate, onSelect }) {
  return (
    <button
      className="candidate-card"
      type="button"
      onClick={() => onSelect(candidate)}
      aria-label={`Select ${candidate.name}, ${candidate.role}`}
    >
      <span className={`avatar avatar--${candidate.accent}`} aria-hidden="true">
        {candidate.initials}
      </span>
      <span className="candidate-card__identity">
        <strong>{candidate.name}</strong>
        <span>{candidate.role}</span>
      </span>
      <span className="candidate-card__experience">
        {candidate.experience} {candidate.experience === 1 ? 'year' : 'years'} experience
      </span>
      <span className="candidate-card__signals" aria-label="Learning journey summary">
        {candidate.cardSignals.map((signal) => (
          <span className={`signal-chip signal-chip--${signal.tone}`} key={signal.label}>
            {signal.label}
          </span>
        ))}
      </span>
      <span className="candidate-card__select">
        View learning journey <span aria-hidden="true">→</span>
      </span>
    </button>
  )
}

export default CandidateCard
