import { useState, useEffect } from 'react'
import VotingPage from './VotingPage'
import ResultsPage from './ResultsPage'
import LoginPage from './LoginPage'
import { SpeedInsights } from '@vercel/speed-insights/react'

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'voting' | 'results'>('login')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('voting_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setCurrentPage('voting')
      } catch (error) {
        localStorage.removeItem('voting_user')
      }
    }
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
    setCurrentPage('voting')
  }

  const handleLogout = () => {
    localStorage.removeItem('voting_user')
    setUser(null)
    setCurrentPage('login')
  }

  return (
    <div>
      {currentPage === 'login' ? (
        <LoginPage onLogin={handleLogin} />
      ) : currentPage === 'voting' ? (
        <VotingPage 
          onSwitchToResults={() => setCurrentPage('results')} 
          user={user}
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