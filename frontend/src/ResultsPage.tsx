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
  const [isAdmin, setIsAdmin] = useState(false)

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
    <div className="min-h-screen p-4" style={{ backgroundColor: '#2a0845', background: 'linear-gradient(135deg, #2a0845 0%, #6441A5 50%, #2a0845 100%)', color: '#ffffff' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="mb-4">
            <div className="text-6xl text-center animate-bounce">🏰✨🎆</div>
            <div className="text-2xl text-center mt-2">🧚♀️🤴👸👑🎭🎉</div>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#FFD700' }}>
            ✨ STI Myanmar Fresher Welcome ✨
          </h1>
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#6441A5' }}>
            🎭 Magical Results Dashboard 🎭
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${isUpdating ? 'bg-green-400 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-sm" style={{ color: '#FFD700' }}>Live • Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <div className="space-x-4">
            <button
              onClick={onSwitchToVoting}
              className="px-6 py-3 rounded-lg text-white font-bold transition-all duration-200 shadow-lg"
              style={{
                background: 'linear-gradient(45deg, #6441A5, #2a0845)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(100, 65, 165, 0.4)'
              }}
            >
              🏰 Back to Voting
            </button>
            {!isAdmin && (
              <button
                onClick={() => {
                  const adminEmail = prompt('Enter admin email:')
                  if (adminEmail === 'dr.waing1984@gmail.com') {
                    setIsAdmin(true)
                    alert('Admin access granted!')
                  } else if (adminEmail) {
                    alert('Access denied. Invalid admin email.')
                    setIsAdmin(false)
                  }
                }}
                className="px-6 py-3 rounded-lg text-white font-bold transition-all duration-200 shadow-lg"
                style={{
                  background: 'linear-gradient(45deg, #6441A5, #2a0845)',
                  border: '2px solid #FFD700'
                }}
              >
                🔐 Admin Login
              </button>
            )}
            {isAdmin && (
              <>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to reset all votes? This cannot be undone!')) {
                      try {
                        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
                        
                        const response = await fetch(`${apiUrl}/api/v1/reset`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          }
                        })
                        
                        if (!response.ok) {
                          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
                        }
                        
                        const data = await response.json()
                        
                        if (data.success) {
                          alert('All votes have been reset!')
                          setIsAdmin(false) // Logout after reset
                          window.location.reload()
                        } else {
                          alert('Reset failed: ' + (data.message || 'Unknown error'))
                        }
                      } catch (error: any) {
                        console.error('Reset error:', error)
                        alert('Error resetting votes. Check console for details.')
                      }
                    }
                  }}
                  className="px-6 py-3 rounded-lg text-white font-bold transition-all duration-200 shadow-lg"
                  style={{
                    background: 'linear-gradient(45deg, #FF6347, #DC143C)',
                    border: '2px solid #FFD700'
                  }}
                >
                  🔄 Reset All Votes
                </button>
                <button
                  onClick={() => setIsAdmin(false)}
                  className="px-6 py-3 rounded-lg text-white font-bold transition-all duration-200 shadow-lg"
                  style={{
                    background: 'linear-gradient(45deg, #666, #333)',
                    border: '2px solid #FFD700'
                  }}
                >
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Results Grid - Responsive layout to prevent overlap */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6 items-start">
          {Object.entries(counts).filter(([key]) => key !== 'total').map(([key, count]) => (
            <div 
              key={key}
              className="p-3 rounded-lg shadow-xl h-full flex flex-col"
              style={{
                backgroundColor: 'rgba(100, 65, 165, 0.2)',
                border: '2px solid #6441A5',
                boxShadow: '0 10px 25px rgba(100, 65, 165, 0.3)',
                backdropFilter: 'blur(10px)',
                minHeight: '280px'
              }}
            >
              <div className="text-center mb-2" style={{ height: '80px' }}>
                <div className="w-12 h-12 mx-auto mb-1 rounded-full flex items-center justify-center animate-pulse" style={{ background: 'linear-gradient(45deg, #FFD700, #FF69B4, #00CED1)', border: '2px solid #FFD700' }}>
                  <span className="text-xl">
                    {key === 'King' ? '👑' : 
                     key === 'Queen' ? '👸' :
                     key === 'Prince' ? '🤴' :
                     key === 'Princess' ? '👰' :
                     key === 'Best Costume Male' ? '🤵' :
                     key === 'Best Costume Female' ? '💃' : '🎭'}
                  </span>
                </div>
                <h3 className="text-sm font-bold leading-tight" style={{ color: '#FFD700', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{key}</h3>
                <div className="text-xs" style={{ color: '#FFD700', height: '15px' }}>
                  {key === 'King' ? '✨🏰✨' : 
                   key === 'Queen' ? '🌹💎🌹' :
                   key === 'Prince' ? '⚔️🏰⚔️' :
                   key === 'Princess' ? '🌸✨🌸' :
                   key === 'Best Costume Male' ? '🎭🎆🎭' :
                   key === 'Best Costume Female' ? '🎀✨🎀' : '🎆🎭🎆'}
                </div>
              </div>
              
              {/* Vote Count */}
              <div className="text-center mb-4" style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className={`text-xl font-bold drop-shadow-lg transition-all duration-500 ${isUpdating ? 'scale-110' : ''}`} style={{ color: isUpdating ? '#32CD32' : '#FFD700' }}>{count}</p>
              </div>
              
              {/* Percentage */}
              <div className="text-center mb-4" style={{ height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="text-xs font-semibold" style={{ color: '#ffffff' }}>
                  {counts.total > 0 ? Math.round((count / counts.total) * 100) : 0}%
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-2" style={{ height: '20px' }}>
                <div className="h-2 rounded-full overflow-hidden border" style={{ backgroundColor: '#2a0845', borderColor: '#6441A5' }}>
                  <div 
                    className={`h-full transition-all duration-700 ease-out ${isUpdating ? 'animate-pulse' : ''}`}
                    style={{
                      width: `${counts.total > 0 ? (count / counts.total) * 100 : 0}%`,
                      background: 'linear-gradient(90deg, #6441A5 0%, #FFD700 50%, #6441A5 100%)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Leading Candidate */}
              <div className="mt-auto" style={{ height: '80px' }}>
                {results[key] && (
                  <div className="p-2 rounded border h-full flex flex-col justify-center" style={{ backgroundColor: 'rgba(42, 8, 69, 0.8)', borderColor: '#6441A5' }}>
                    <p className="text-xs mb-1" style={{ color: '#FFD700' }}>🏆 Leading:</p>
                    <p className="text-xs font-bold leading-tight" style={{ color: '#ffffff' }}>
                      {results[key].leading_candidate}
                    </p>
                    <p className="text-xs" style={{ color: '#FFD700' }}>
                      {results[key].votes} votes
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Total Votes - Enhanced Display */}
        <div className="text-center mb-6">
          <div 
            className="p-8 rounded-xl inline-block transform hover:scale-105 transition-transform duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(100, 65, 165, 0.4) 0%, rgba(42, 8, 69, 0.9) 100%)',
              border: '4px solid #FFD700',
              boxShadow: '0 30px 60px rgba(255, 215, 0, 0.6)',
              backdropFilter: 'blur(15px)'
            }}
          >
            <div className="text-4xl mb-2">🏆✨🎭✨🏆</div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#FFD700' }}>
              🎭 TOTAL VOTES 🎭
            </h2>
            <p className={`text-6xl font-bold mb-3 drop-shadow-2xl transition-all duration-500 ${isUpdating ? 'scale-110 animate-pulse' : ''}`} style={{ color: isUpdating ? '#32CD32' : '#FFD700', textShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}>{counts.total}</p>
            <p className="text-lg italic font-semibold" style={{ color: '#ffffff' }}>✨ magical votes cast! ✨</p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="flex items-center justify-center gap-2" style={{ color: '#FFD700' }}>
            <span className={`inline-block w-2 h-2 rounded-full ${isUpdating ? 'bg-green-400 animate-ping' : 'bg-yellow-400'}`}></span>
            ✨ Auto-refreshing every 2 seconds • "Bibbidi-Bobbidi-Boo!" 🪄
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage