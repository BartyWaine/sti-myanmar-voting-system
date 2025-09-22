import { useState, useEffect } from 'react'

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

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com', // Replace with your Google Client ID
          callback: handleGoogleLogin
        })

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: 300,
            text: 'signin_with'
          }
        )
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleGoogleLogin = (response: any) => {
    setIsLoading(true)
    try {
      // Decode JWT token
      const payload = JSON.parse(atob(response.credential.split('.')[1]))
      
      const user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        provider: 'google'
      }

      // Store user data
      localStorage.setItem('voting_user', JSON.stringify(user))
      onLogin(user)
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookLogin = () => {
    setIsLoading(true)
    
    // Load Facebook SDK
    if (!(window as any).FB) {
      const script = document.createElement('script')
      script.src = 'https://connect.facebook.net/en_US/sdk.js'
      script.async = true
      document.body.appendChild(script)
      
      script.onload = () => {
        (window as any).FB.init({
          appId: '1234567890123456', // Replace with your Facebook App ID
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        })
        
        performFacebookLogin()
      }
    } else {
      performFacebookLogin()
    }
  }

  const performFacebookLogin = () => {
    (window as any).FB.login((response: any) => {
      if (response.authResponse) {
        (window as any).FB.api('/me', { fields: 'name,email,picture' }, (userInfo: any) => {
          const user = {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture?.data?.url,
            provider: 'facebook'
          }

          localStorage.setItem('voting_user', JSON.stringify(user))
          onLogin(user)
          setIsLoading(false)
        })
      } else {
        alert('Facebook login failed')
        setIsLoading(false)
      }
    }, { scope: 'email' })
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
            {/* Google Sign-In Button */}
            <div className="flex justify-center">
              <div id="google-signin-button"></div>
            </div>

            <div className="text-center text-sm" style={{ color: '#FFD700' }}>
              or
            </div>

            {/* Facebook Login Button */}
            <button
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              style={{
                background: 'linear-gradient(45deg, #1877F2, #42A5F5)',
                border: '2px solid #1877F2'
              }}
            >
              {isLoading ? '🔄 Logging in...' : '📘 Continue with Facebook'}
            </button>

            <div className="mt-6 text-center text-sm" style={{ color: '#ffffff' }}>
              <p>🔒 Your data is secure and only used for voting verification</p>
              <p className="mt-2">One vote per account • No spam • Privacy protected</p>
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