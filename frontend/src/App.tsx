import { useState, useEffect } from 'react'
import VotingPage from './VotingPage'
import ResultsPage from './ResultsPage'
import OAuthLoginPage from './OAuthLoginPage'
import { SpeedInsights } from '@vercel/speed-insights/react'

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'voting' | 'results'>('login')
  const [user, setUser] = useState<any>(null)
  const [authToken, setAuthToken] = useState<string>('')

  useEffect(() => {
    const savedUser = localStorage.getItem('voting_user')
    const savedToken = localStorage.getItem('voting_token')
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setAuthToken(savedToken)
        setCurrentPage('voting')
      } catch (error) {
        localStorage.removeItem('voting_user')
        localStorage.removeItem('voting_token')
      }
    }
  }, [])

  const handleLogin = (userData: any, token: string) => {
    setUser(userData)
    setAuthToken(token)
    setCurrentPage('voting')
  }

  const handleLogout = async () => {
    // Call logout API
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'https://sti-myanmar-voting-system.onrender.com'}/api/v1/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: authToken })
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    localStorage.removeItem('voting_user')
    localStorage.removeItem('voting_token')
    setUser(null)
    setAuthToken('')
    setCurrentPage('login')
  }

  return (
    <div>
      {currentPage === 'login' ? (
        <OAuthLoginPage onLogin={handleLogin} />
      ) : currentPage === 'voting' ? (
        <VotingPage 
          onSwitchToResults={() => setCurrentPage('results')} 
          user={user}
          authToken={authToken}
          onLogout={handleLogout}
        />
      ) : (
        <ResultsPage 
          onSwitchToVoting={() => setCurrentPage('voting')} 
          user={user}
          onLogout={handleLogout}
        />
      )}
      <SpeedInsights />
    </div>
  )
}

export default App