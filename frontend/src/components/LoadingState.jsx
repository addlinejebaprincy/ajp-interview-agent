function LoadingState({ isComplete }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-orb" aria-hidden="true"><i /><i /><i /></span>
      <div>
        <strong>{isComplete ? 'Preparing your evaluation...' : 'Preparing your next adaptive question...'}</strong>
        <span>{isComplete ? 'Turning your responses into focused feedback.' : 'Calibrating depth from your latest response.'}</span>
      </div>
    </div>
  )
}

export default LoadingState
