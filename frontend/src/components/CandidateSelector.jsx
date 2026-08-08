import { useMemo, useState } from 'react'
import CandidateCard from './CandidateCard'
import { candidates } from '../data/candidateData'

const PAGE_SIZE = 6

function CandidateSelector({ onSelect, onBack }) {
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filteredCandidates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return candidates

    return candidates.filter((candidate) =>
      `${candidate.name} ${candidate.role}`.toLowerCase().includes(normalizedQuery),
    )
  }, [query])

  const visibleCandidates = filteredCandidates.slice(0, visibleCount)
  const hasMore = visibleCandidates.length < filteredCandidates.length

  const updateQuery = (event) => {
    setQuery(event.target.value)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <section className="selection-view" aria-labelledby="candidate-selector-title">
      <button className="text-button back-button" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span> Back to options
      </button>
      <div className="section-heading candidate-selector-heading">
        <span className="eyebrow">Official candidate library</span>
        <h2 id="candidate-selector-title">Choose a learning journey</h2>
        <p>Browse all 20 synthetic cohort profiles, each mapped directly from the provided mission history.</p>
      </div>

      <div className="candidate-toolbar">
        <label className="candidate-search">
          <span className="sr-only">Search candidates by name or role</span>
          <span className="candidate-search__icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={updateQuery}
            placeholder="Search by name or role..."
          />
        </label>
        <span className="candidate-result-count" aria-live="polite">
          {filteredCandidates.length} {filteredCandidates.length === 1 ? 'candidate' : 'candidates'}
        </span>
      </div>

      {visibleCandidates.length > 0 ? (
        <>
          <div className="candidate-grid">
            {visibleCandidates.map((candidate) => (
              <CandidateCard candidate={candidate} onSelect={onSelect} key={candidate.id} />
            ))}
          </div>
          {hasMore && (
            <div className="show-more-wrap">
              <button
                className="button button--secondary"
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                Show more candidates
                <span aria-hidden="true">↓</span>
              </button>
              <span>Showing {visibleCandidates.length} of {filteredCandidates.length}</span>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">⌕</span>
          <strong>No candidates found</strong>
          <p>Try a different name or job role.</p>
          <button className="text-button" type="button" onClick={() => setQuery('')}>Clear search</button>
        </div>
      )}
    </section>
  )
}

export default CandidateSelector
