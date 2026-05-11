import { saveStoredMode } from '../utils/storage'

// ModeSelector component
export default function ModeSelector({ currentMode, onModeChange }) {
  const modes = [
    {
      id: 'deep-work',
      label: 'Deep Work',
      icon: '🎯',
      description: 'Spacious 2-column view'
    },
    {
      id: 'quick-scan',
      label: 'Quick Scan',
      icon: '⚡',
      description: 'Compact 3-column view'
    },
    {
      id: 'creative-spark',
      label: 'Creative Spark',
      icon: '✨',
      description: 'Expressive layout'
    }
  ]

  const handleModeClick = (modeId) => {
    saveStoredMode(modeId)
    onModeChange(modeId)
  }

  return (
    <div className="bg-white border-4 border-black rounded-lg p-4 shadow-hard mb-6">
      <h3 className="font-bold text-sm text-studio-text mb-3 uppercase">Cognitive Mode</h3>
      <div className="grid grid-cols-3 gap-2">
        {modes.map(mode => (
          <button
            key={mode.id}
            onClick={() => handleModeClick(mode.id)}
            className={`
              p-3 rounded-lg font-bold text-sm transition-all border-3
              ${currentMode === mode.id 
                ? 'bg-black text-white border-black shadow-hard' 
                : 'bg-studio-50 text-black border-black hover:bg-white'
              }
            `}
          >
            <div className="text-xl mb-1">{mode.icon}</div>
            <div>{mode.label}</div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-600 mt-2">
        {modes.find(m => m.id === currentMode)?.description}
      </p>
    </div>
  )
}
