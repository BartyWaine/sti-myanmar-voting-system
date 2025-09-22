import { useState } from 'react'

interface LoginPageProps {
  onLogin: (user: any) => void
}

declare global {
  interface Window {
    google: any;
    gapi: any;
    FB: any;
  }
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Demo login - works without OAuth setup
  const handleDemoGoogleLogin = () => {
    setIsLoading(true)
    
    // Simulate Google login
    setTimeout(() => {
      const user = {
        id: 'demo_google_' + Date.now(),
        email: 'demo@gmail.com',
        name: 'Demo Google User',
        picture: 'https://via.placeholder.com/40',
        provider: 'google'
      }
      
      localStorage.setItem('voting_user', JSON.stringify(user))
      onLogin(user)
      setIsLoading(false)
    }, 1000)
  }



  const handleDemoFacebookLogin = () => {
    setIsLoading(true)
    
    // Simulate Facebook login
    setTimeout(() => {
      const user = {
        id: 'demo_facebook_' + Date.now(),
        email: 'demo@facebook.com',
        name: 'Demo Facebook User',
        picture: 'https://via.placeholder.com/40',
        provider: 'facebook'
      }
      
      localStorage.setItem('voting_user', JSON.stringify(user))
      onLogin(user)
      setIsLoading(false)
    }, 1000)
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
            🔐 Secure Login Required
          </h2>
          <p className="text-lg mb-8" style={{ color: '#FFD700' }}>
            Please login with your social account to vote
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
            {/* Demo Google Login Button */}
            <button
              onClick={handleDemoGoogleLogin}
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              style={{
                background: 'linear-gradient(45deg, #4285F4, #34A853)',
                border: '2px solid #4285F4'
              }}
            >
              {isLoading ? '🔄 Logging in...' : '🔍 Continue with Google (Demo)'}
            </button>

            <div className="text-center text-sm" style={{ color: '#FFD700' }}>
              or
            </div>

            {/* Demo Facebook Login Button */}
            <button
              onClick={handleDemoFacebookLogin}
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              style={{
                background: 'linear-gradient(45deg, #1877F2, #42A5F5)',
                border: '2px solid #1877F2'
              }}
            >
              {isLoading ? '🔄 Logging in...' : '📘 Continue with Facebook (Demo)'}
            </button>

            <div className="mt-6 text-center text-sm" style={{ color: '#ffffff' }}>
              <p>🔒 Demo Mode - No real authentication required</p>
              <p className="mt-2">One vote per session • Secure voting system</p>
              <p className="mt-2 text-xs" style={{ color: '#FFD700' }}>Note: This is a demo. Real OAuth can be configured later.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs" style={{ color: '#FFD700' }}>
          <p>✨ Secure voting powered by social authentication ✨</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage