import { useState } from 'react'

interface VotingPageProps {
  onSwitchToResults: () => void
}

function VotingPage({ onSwitchToResults }: VotingPageProps) {
  const [votingNames, setVotingNames] = useState<{[key: string]: string}>({})
  const [deviceToken] = useState(() => {
    let token = localStorage.getItem('voting_device_token')
    if (!token) {
      token = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('voting_device_token', token)
    }
    return token
  })

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
      alert('Please enter a name first!')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/v1/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_token: deviceToken,
          category: category,
          candidate_name: name
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
    <div className="min-h-screen p-6" style={{ backgroundColor: '#000000', background: 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #000000 100%)', color: '#e9d5ff' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-yellow-300">
            🎓 STI Myanmar Fresher Welcome 🎓
          </h1>
          <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-500">
            🗳️ Cast Your Votes
          </h2>
          <button
            onClick={onSwitchToResults}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-lg"
          >
            📊 View Results Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div 
              key={category}
              className="p-6 rounded-xl shadow-2xl transition-all duration-300 hover:transform hover:scale-105"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: '2px solid rgba(147, 51, 234, 0.6)',
                boxShadow: '0 15px 35px rgba(147, 51, 234, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3 className="text-xl font-semibold mb-4 text-center text-purple-100">{category}</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="✨ Enter candidate name"
                  value={votingNames[category] || ''}
                  onChange={(e) => handleVotingNameChange(category, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
                  style={{
                    backgroundColor: '#2d1b69',
                    border: '2px solid rgba(147, 51, 234, 0.5)',
                    fontSize: '16px',
                    color: '#ffffff',
                    caretColor: '#ffffff'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#9333ea'
                    e.target.style.boxShadow = '0 0 20px rgba(147, 51, 234, 0.5)'
                    e.target.style.backgroundColor = '#3730a3'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(147, 51, 234, 0.5)'
                    e.target.style.boxShadow = 'none'
                    e.target.style.backgroundColor = '#2d1b69'
                  }}
                />
                
                <button
                  onClick={() => handleVote(category)}
                  className="w-full px-4 py-3 rounded-lg font-bold text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    border: '1px solid rgba(147, 51, 234, 0.8)',
                    boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(147, 51, 234, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(147, 51, 234, 0.3)'
                  }}
                >
                  🗳️ VOTE
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