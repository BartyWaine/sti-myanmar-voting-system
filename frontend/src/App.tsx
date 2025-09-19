import { useState } from 'react'
import VotingPage from './VotingPage'
import ResultsPage from './ResultsPage'
import { SpeedInsights } from '@vercel/speed-insights/react'

function App() {
  const [currentPage, setCurrentPage] = useState<'voting' | 'results'>('voting')

  return (
    <div>
      {currentPage === 'voting' ? (
        <VotingPage onSwitchToResults={() => setCurrentPage('results')} />
      ) : (
        <ResultsPage onSwitchToVoting={() => setCurrentPage('voting')} />
      )}
      <SpeedInsights />
    </div>
  )
}

export default App