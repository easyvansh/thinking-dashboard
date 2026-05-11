export default function ModeSelector({ currentMode, onModeChange }) {
  const modes = [
    {
      id: 'deep-work',
      label: 'Deep Work',
      marker: '01',
      description: 'Spacious single-column reading cards'
    },
    {
      id: 'quick-scan',
      label: 'Quick Scan',
      marker: '02',
      description: 'Denser grid for fast triage'
    },
    {
      id: 'creative-spark',
      label: 'Creative Spark',
      marker: '03',
      description: 'A looser studio board'
    }
  ]

  return (
    <div className="studio-panel p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">Cognitive Modes</h3>
          <p className="font-header mt-1 text-2xl font-black italic">
            {modes.find((mode) => mode.id === currentMode)?.description}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`border-2 border-[var(--border)] p-4 text-left transition-all ${
              currentMode === mode.id
                ? 'bg-[var(--text-primary)] text-[var(--bg-page)]'
                : 'bg-[var(--bg-card)] hover:bg-[var(--accent)] hover:text-white'
            }`}
          >
            <span className="font-ui mb-4 block text-[10px] font-bold uppercase tracking-widest opacity-60">{mode.marker}</span>
            <span className="font-ui block text-sm font-bold uppercase tracking-wider">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
