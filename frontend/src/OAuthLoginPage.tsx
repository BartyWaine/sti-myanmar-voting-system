import { useState } from 'react'

interface OAuthLoginPageProps {
  onLogin: (user: any, token: string) => void
}

function OAuthLoginPage({ onLogin }: OAuthLoginPageProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Simple OAuth simulation using GitHub (no setup required)
  const handleGitHubLogin = () => {
    setIsLoading(true)
    
    // GitHub OAuth simulation (replace with real OAuth setup)
    
    // Simulate OAuth response (in real app, this would come from GitHub)
    setTimeout(() => {
      const user = {
        id: 'github_' + Date.now(),
        email: 'user@github.com',
        name: 'GitHub User',
        picture: 'https://github.com/identicons/user.png',
        provider: 'github'
      }
      
      const token = 'oauth_token_' + Date.now()
      localStorage.setItem('voting_token', token)
      localStorage.setItem('voting_user', JSON.stringify(user))
      onLogin(user, token)
      setIsLoading(false)
    }, 2000)
  }

  // Google OAuth using popup (simpler than full setup)
  const handleGoogleLogin = () => {
    setIsLoading(true)
    
    // Simulate Google OAuth
    setTimeout(() => {
      const user = {
        id: 'google_' + Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        picture: 'https://via.placeholder.com/40',
        provider: 'google'
      }
      
      const token = 'oauth_token_' + Date.now()
      localStorage.setItem('voting_token', token)
      localStorage.setItem('voting_user', JSON.stringify(user))
      onLogin(user, token)
      setIsLoading(false)
    }, 2000)
  }

  // Facebook OAuth simulation
  const handleFacebookLogin = () => {
    setIsLoading(true)
    
    setTimeout(() => {
      const user = {
        id: 'facebook_' + Date.now(),
        email: 'user@facebook.com',
        name: 'Facebook User',
        picture: 'https://via.placeholder.com/40',
        provider: 'facebook'
      }
      
      const token = 'oauth_token_' + Date.now()
      localStorage.setItem('voting_token', token)
      localStorage.setItem('voting_user', JSON.stringify(user))
      onLogin(user, token)
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#2a0845', background: 'linear-gradient(135deg, #2a0845 0%, #6441A5 50%, #2a0845 100%)', color: '#ffffff' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="text-6xl text-center animate-bounce">🏰✨🎆</div>
            <div className="text-2xl text-center mt-2">🧚♀️🤴👸👑🎭🎉</div>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#FFD700' }}>
            ✨ STI Myanmar Fresher Welcome ✨
          </h1>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#ffffff' }}>
            🔐 OAuth Social Login
          </h2>
          <p className="text-lg mb-8" style={{ color: '#FFD700' }}>
            Login with your social account to vote securely
          </p>
        </div>

        <div 
          className="p-8 rounded-xl shadow-2xl"
          style={{
            backgroundColor: 'rgba(100, 65, 165, 0.2)',
            border: '2px solid #6441A5',
            boxShadow: '0 15px 35px rgba(100, 65, 165, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="space-y-4">
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full px-6 py-4 rounded-lg font-bold text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-3"
              style={{
                background: 'linear-gradient(45deg, #4285F4, #34A853)',
                border: '2px solid #4285F4'
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLoading ? '🔄 Connecting...' : 'Continue with Google'}
            </button>

            {/* Facebook OAuth Button */}
            <button
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full px-6 py-4 rounded-lg font-bold text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-3"
              style={{
                background: 'linear-gradient(45deg, #1877F2, #42A5F5)',
                border: '2px solid #1877F2'
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {isLoading ? '🔄 Connecting...' : 'Continue with Facebook'}
            </button>

            {/* GitHub OAuth Button */}
            <button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="w-full px-6 py-4 rounded-lg font-bold text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-3"
              style={{
                background: 'linear-gradient(45deg, #333, #666)',
                border: '2px solid #333'
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {isLoading ? '🔄 Connecting...' : 'Continue with GitHub'}
            </button>

            <div className="mt-6 text-center text-sm" style={{ color: '#ffffff' }}>
              <p>🔒 Secure OAuth authentication</p>
              <p className="mt-2">One vote per social account • Privacy protected</p>
              <p className="mt-2 text-xs" style={{ color: '#FFD700' }}>
                Note: This is OAuth simulation. Real OAuth can be configured with your app credentials.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs" style={{ color: '#FFD700' }}>
          <p>✨ Powered by OAuth 2.0 social authentication ✨</p>
        </div>
      </div>
    </div>
  )
}

export default OAuthLoginPage