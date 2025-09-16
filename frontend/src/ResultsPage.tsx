import { useState, useEffect } from 'react'
import axios from 'axios'

interface VoteCounts {
  King: number
  Queen: number
  Prince: number
  Princess: number
  'Best Costume Male': number
  'Best Costume Female': number
  'Best Performance Award': number
  total: number
}

interface ResultsPageProps {
  onSwitchToVoting: () => void
}

function ResultsPage({ onSwitchToVoting }: ResultsPageProps) {
  const [counts, setCounts] = useState<VoteCounts>({
    King: 0,
    Queen: 0,
    Prince: 0,
    Princess: 0,
    'Best Costume Male': 0,
    'Best Costume Female': 0,
    'Best Performance Award': 0,
    total: 0
  })

  const [results, setResults] = useState<any>({})
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsUpdating(true)
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
        const [countsResponse, resultsResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/v1/counts`),
          axios.get(`${apiUrl}/api/v1/results`)
        ])
        setCounts(countsResponse.data)
        setResults(resultsResponse.data)
        setLastUpdate(new Date())
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsUpdating(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#000000', background: 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #000000 100%)', color: '#e9d5ff' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-yellow-300">
            🎓 STI Myanmar Fresher Welcome 🎓
          </h1>
          <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-500">
            📊 Live Results Dashboard
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${isUpdating ? 'bg-green-400 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-sm text-purple-200">Live • Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <div className="space-x-4">
            <button
              onClick={onSwitchToVoting}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg"
            >
              🗳️ Back to Voting
            </button>
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to reset all votes? This cannot be undone!')) {
                  try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
                    const response = await fetch(`${apiUrl}/api/v1/reset`, { method: 'POST' })
                    const data = await response.json()
                    
                    if (data.success) {
                      // Reset local state immediately
                      setCounts({
                        King: 0,
                        Queen: 0,
                        Prince: 0,
                        Princess: 0,
                        'Best Costume Male': 0,
                        'Best Costume Female': 0,
                        'Best Performance Award': 0,
                        total: 0
                      })
                      setResults({})
                      setLastUpdate(new Date())
                      alert('All votes have been reset!')
                      // Refresh page to ensure clean state
                      window.location.reload()
                    } else {
                      alert('Error: ' + data.message)
                    }
                  } catch (error) {
                    alert('Error resetting votes: ' + error.message)
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg"
            >
              🔄 Reset All Votes
            </button>
          </div>
        </div>

        {/* Results Grid - All 7 categories in one row */}
        <div className="grid grid-cols-7 gap-3 mb-6">
          {Object.entries(counts).filter(([key]) => key !== 'total').map(([key, count]) => (
            <div 
              key={key}
              className="p-3 rounded-lg shadow-xl"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: '2px solid rgba(147, 51, 234, 0.6)',
                boxShadow: '0 10px 25px rgba(147, 51, 234, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3 className="text-sm font-bold text-center text-purple-100 mb-2">{key}</h3>
              
              {/* Vote Count */}
              <div className="text-center mb-2">
                <p className={`text-2xl font-bold text-white drop-shadow-lg transition-all duration-500 ${isUpdating ? 'scale-110 text-green-400' : ''}`}>{count}</p>
                <p className="text-xs text-purple-200 font-semibold">
                  {counts.total > 0 ? Math.round((count / counts.total) * 100) : 0}%
                </p>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-black/70 rounded-full overflow-hidden border border-purple-400/30 mb-2">
                <div 
                  className={`h-full transition-all duration-700 ease-out ${isUpdating ? 'animate-pulse' : ''}`}
                  style={{
                    width: `${counts.total > 0 ? (count / counts.total) * 100 : 0}%`,
                    background: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)'
                  }}
                ></div>
              </div>

              {/* Leading Candidate */}
              {results[key] && (
                <div className="p-2 bg-black/50 rounded border border-purple-400/30">
                  <p className="text-xs text-purple-300 mb-1">🏆 Leading:</p>
                  <p className="text-xs font-bold text-yellow-400 leading-tight">
                    {results[key].leading_candidate}
                  </p>
                  <p className="text-xs text-purple-200">
                    {results[key].votes} votes
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Total Votes */}
        <div className="text-center">
          <div 
            className="p-6 rounded-xl inline-block"
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(88,28,135,0.3) 100%)',
              border: '1px solid rgba(147, 51, 234, 0.5)',
              boxShadow: '0 25px 50px rgba(147, 51, 234, 0.3)'
            }}
          >
            <h2 className="text-3xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-400">
              🕸️ Total Votes
            </h2>
            <p className={`text-5xl font-bold text-purple-100 mb-2 drop-shadow-lg transition-all duration-500 ${isUpdating ? 'scale-110 text-green-300' : ''}`}>{counts.total}</p>
            <p className="text-purple-200/80 italic">souls have spoken</p>
          </div>
        </div>

        <div className="mt-6 text-center text-purple-300/60 text-sm">
          <p className="flex items-center justify-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${isUpdating ? 'bg-green-400 animate-ping' : 'bg-purple-400'}`}></span>
            🕷️ Auto-refreshing every 2 seconds • "How delightfully morbid"
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage