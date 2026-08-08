function ProgressBar({ current, total }) {
  const progress = Math.round(((current - 1) / total) * 100)

  return (
    <div className="progress-wrap">
      <div className="progress-meta">
        <span>Question {current} of {total}</span>
        <span>{progress}% complete</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Interview progress"
        aria-valuemin="0"
        aria-valuemax={total}
        aria-valuenow={current - 1}
      >
        <span style={{ width: `${Math.max(progress, 3)}%` }} />
      </div>
    </div>
  )
}

export default ProgressBar
