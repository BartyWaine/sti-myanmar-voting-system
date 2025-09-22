import { useState } from 'react'

interface RealLoginPageProps {
  onLogin: (user: any, token: string) => void
}

function RealLoginPage({ onLogin }: RealLoginPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const endpoint = isLogin ? '/api/v1/login' : '/api/v1/register'
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, name: formData.name }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://sti-myanmar-voting-system.onrender.com'}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()
      
      if (data.success) {
        if (isLogin) {
          // Login successful
          localStorage.setItem('voting_token', data.token)
          localStorage.setItem('voting_user', JSON.stringify(data.user))
          onLogin(data.user, data.token)
        } else {
          // Registration successful, switch to login
          alert('✅ Account created! Please login.')
          setIsLogin(true)
          setFormData({ email: formData.email, password: '', name: '' })
        }
      } else {
        alert(`❌ ${data.message}`)
      }
    } catch (error: any) {
      alert(`❌ Error: ${error.message || 'Network connection failed'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
            🔐 {isLogin ? 'Login to Vote' : 'Create Account'}
          </h2>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#FFD700' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  style={{
                    backgroundColor: 'rgba(42, 8, 69, 0.8)',
                    border: '2px solid #6441A5',
                    color: '#ffffff'
                  }}
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#FFD700' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                style={{
                  backgroundColor: 'rgba(42, 8, 69, 0.8)',
                  border: '2px solid #6441A5',
                  color: '#ffffff'
                }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#FFD700' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                style={{
                  backgroundColor: 'rgba(42, 8, 69, 0.8)',
                  border: '2px solid #6441A5',
                  color: '#ffffff'
                }}
                placeholder={isLogin ? "Enter your password" : "Create a password (min 6 chars)"}
                minLength={isLogin ? undefined : 6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              style={{
                background: 'linear-gradient(45deg, #6441A5, #2a0845)',
                border: '2px solid #FFD700'
              }}
            >
              {isLoading ? '🔄 Processing...' : (isLogin ? '🔐 Login' : '📝 Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setFormData({ email: '', password: '', name: '' })
              }}
              className="text-sm underline transition-colors duration-200"
              style={{ color: '#FFD700' }}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm" style={{ color: '#ffffff' }}>
            <p>🔒 Secure authentication • One vote per account</p>
            <p className="mt-2">Your data is encrypted and protected</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealLoginPage