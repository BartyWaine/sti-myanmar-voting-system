import { useState, useEffect } from 'react'
import { SecurityManager } from './security'

interface VotingPageProps {
  onSwitchToResults: () => void
  user: any
  authToken: string
}

function VotingPage({ onSwitchToResults, user, authToken }: VotingPageProps) {
  const [votingNames, setVotingNames] = useState<{[key: string]: string}>({})
  const [securityData, setSecurityData] = useState<any>(null)
  const security = SecurityManager.getInstance()

  useEffect(() => {
    const data = security.initialize()
    setSecurityData(data)
  }, [])

  const categories = [
    'King', 'Queen', 'Prince', 'Princess', 
    'Best Costume Male', 'Best Costume Female', 'Best Performance Award'
  ]

  const handleVotingNameChange = (category: string, name: string) => {
    setVotingNames(prev => ({ ...prev, [category]: name }))
  }

  const handleVote = async (category: string) => {
    const name = votingNames[category]?.trim()
    if (!name) {
      alert('Please enter a candidate number first!')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://sti-myanmar-voting-system.onrender.com'}/api/v1/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_token: securityData?.deviceId,
          category: category,
          candidate_name: name,
          security: security.getSecurityData(),
          auth_token: authToken
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`✅ Vote recorded for ${name} in ${category}!`)
        setVotingNames(prev => ({ ...prev, [category]: '' }))
      } else {
        alert(`❌ ${data.message}`)
      }
    } catch (error: any) {
      alert(`❌ Error: ${error.message || 'Network connection failed'}`)
    }
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#2a0845', background: 'linear-gradient(135deg, #2a0845 0%, #6441A5 50%, #2a0845 100%)', color: '#ffffff' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="text-6xl text-center animate-bounce">🏰✨🎆</div>
            <div className="text-2xl text-center mt-2">🧚‍♀️🤴👸👑🎭🎉</div>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#FFD700' }}>
            ✨ STI Myanmar Fresher Welcome ✨
          </h1>
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#ffffff' }}>
            🏰 Cast Your Magical Votes 🏰
          </h2>
          <div className="flex gap-4 justify-center items-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(100, 65, 165, 0.3)', border: '1px solid #6441A5' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFD700', color: '#2a0845' }}>
                <span className="text-lg font-bold">👤</span>
              </div>
              <span style={{ color: '#FFD700' }}>👋 {user?.name || 'STI Student'}</span>
            </div>
            <button
              onClick={onSwitchToResults}
              className="px-6 py-3 rounded-lg text-white font-bold transition-all duration-200 shadow-lg"
              style={{
                background: 'linear-gradient(45deg, #6441A5, #2a0845)',
                border: '2px solid #FFD700',
                boxShadow: '0 4px 15px rgba(100, 65, 165, 0.4)'
              }}
            >
              <span style={{ color: '#ffffff' }}>🎭 View Results</span>
            </button>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div 
              key={category}
              className="p-6 rounded-xl shadow-2xl transition-all duration-300 hover:transform hover:scale-105"
              style={{
                backgroundColor: 'rgba(100, 65, 165, 0.2)',
                border: '2px solid #6441A5',
                boxShadow: '0 15px 35px rgba(100, 65, 165, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center animate-pulse" style={{ background: 'linear-gradient(45deg, #FFD700, #FF69B4, #00CED1)', border: '3px solid #FFD700' }}>
                  <span className="text-3xl">
                    {category === 'King' ? '👑' : 
                     category === 'Queen' ? '👸' :
                     category === 'Prince' ? '🤴' :
                     category === 'Princess' ? '👰' :
                     category === 'Best Costume Male' ? '🤵' :
                     category === 'Best Costume Female' ? '💃' : '🎭'}
                  </span>
                </div>
                <div className="text-sm text-center" style={{ color: '#FFD700' }}>
                  {category === 'King' ? '🦁✨🏰' : 
                   category === 'Queen' ? '🐱🌹💎' :
                   category === 'Prince' ? '🐶⚔️🏰' :
                   category === 'Princess' ? '🐭🌸✨' :
                   category === 'Best Costume Male' ? '🐻🎭🎆' :
                   category === 'Best Costume Female' ? '🥰🎀✨' : '🐸🎆🎭'}
                </div>
                <h3 className="text-xl font-semibold" style={{ color: '#FFD700' }}>{category}</h3>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="✨ Enter candidate number"
                  value={votingNames[category] || ''}
                  onChange={(e) => handleVotingNameChange(category, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 placeholder-white"
                  style={{
                    backgroundColor: 'rgba(42, 8, 69, 0.8)',
                    border: '2px solid #6441A5',
                    fontSize: '16px',
                    color: '#ffffff',
                    caretColor: '#FFD700'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FFD700'
                    e.target.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.6)'
                    e.target.style.backgroundColor = 'rgba(100, 65, 165, 0.9)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#6441A5'
                    e.target.style.boxShadow = 'none'
                    e.target.style.backgroundColor = 'rgba(42, 8, 69, 0.8)'
                  }}
                />
                
                <button
                  onClick={() => handleVote(category)}
                  className="w-full px-4 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95"

                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.8)'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(100, 65, 165, 0.4)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #6441A5 0%, #2a0845 50%, #FFD700 100%)',
                    border: '2px solid #FFD700',
                    boxShadow: '0 4px 15px rgba(100, 65, 165, 0.4)',
                    color: '#ffffff'
                  }}
                >
                  🏰 VOTE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VotingPage