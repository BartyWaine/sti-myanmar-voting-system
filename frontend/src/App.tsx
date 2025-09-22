import { useState, useEffect } from 'react'
import VotingPage from './VotingPage'
import ResultsPage from './ResultsPage'

import { SpeedInsights } from '@vercel/speed-insights/react'

function App() {
  const [currentPage, setCurrentPage] = useState<'voting' | 'results'>('voting')
  const [user, setUser] = useState<any>({
    id: 'demo_user_' + Date.now(),
    email: 'demo@sti.edu',
    name: 'STI Student',
    picture: 'https://via.placeholder.com/40',
    provider: 'demo'
  })
  const [authToken, setAuthToken] = useState<string>('demo_token_' + Date.now())

  useEffect(() => {
    // Auto-login demo user
    const demoUser = {
      id: 'demo_user_' + Date.now(),
      email: 'demo@sti.edu',
      name: 'STI Student',
      picture: 'https://via.placeholder.com/40',
      provider: 'demo'
    }
    const demoToken = 'demo_token_' + Date.now()
    
    localStorage.setItem('voting_user', JSON.stringify(demoUser))
    localStorage.setItem('voting_token', demoToken)
    setUser(demoUser)
    setAuthToken(demoToken)
  }, [])



  const handleLogout = () => {
    // Just refresh the page to reset
    window.location.reload()
  }

  return (
    <div>
      {currentPage === 'voting' ? (
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