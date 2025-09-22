import { useState } from 'react'

interface SimpleLoginPageProps {
  onLogin: (user: any, token: string) => void
}

function SimpleLoginPage({ onLogin }: SimpleLoginPageProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (provider: string) => {
    setIsLoading(true)
    
    setTimeout(() => {
      const user = {
        id: provider + '_' + Date.now(),
        email: `user@${provider}.com`,
        name: `${provider} User`,
        picture: 'https://via.placeholder.com/40',
        provider: provider
      }
      
      const token = 'token_' + Date.now()
      localStorage.setItem('voting_token', token)
      localStorage.setItem('voting_user', JSON.stringify(user))
      onLogin(user, token)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#1a1a2e',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>👑</div>
          <h1 style={{ fontSize: '28px', marginBottom: '10px', color: '#ffd700' }}>
            STI Myanmar Fresher Welcome
          </h1>
          <p style={{ fontSize: '16px', color: '#ccc' }}>
            Choose your login method
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          padding: '30px', 
          borderRadius: '15px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            
            <button
              onClick={() => handleLogin('google')}
              disabled={isLoading}
              style={{
                padding: '20px 10px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(45deg, #4285F4, #34A853)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '20px' }}>G</div>
              <span>{isLoading ? 'Loading...' : 'Google'}</span>
            </button>

            <button
              onClick={() => handleLogin('facebook')}
              disabled={isLoading}
              style={{
                padding: '20px 10px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(45deg, #1877F2, #42A5F5)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '20px' }}>f</div>
              <span>{isLoading ? 'Loading...' : 'Facebook'}</span>
            </button>

            <button
              onClick={() => handleLogin('github')}
              disabled={isLoading}
              style={{
                padding: '20px 10px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(45deg, #333, #666)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '20px' }}>⚡</div>
              <span>{isLoading ? 'Loading...' : 'GitHub'}</span>
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#ccc' }}>
            🔒 Secure • ⚡ Fast • 🛡️ Private
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleLoginPage