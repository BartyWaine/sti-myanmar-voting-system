import { useState } from 'react'
import VotingPage from './VotingPage'
import ResultsPage from './ResultsPage'

function App() {
  const [currentPage, setCurrentPage] = useState<'voting' | 'results'>('voting')

  return (
    <div>
      {currentPage === 'voting' ? (
        <VotingPage onSwitchToResults={() => setCurrentPage('results')} />
      ) : (
        <ResultsPage onSwitchToVoting={() => setCurrentPage('voting')} />
      )}
    </div>
  )
}

export default App