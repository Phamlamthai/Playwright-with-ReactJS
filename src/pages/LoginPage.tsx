import { useState, type SubmitEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await authApi.login(email, password)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h1>TaskFlow</h1>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label><br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label><br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="form-control"
          />
        </div>
        {error && <p role="alert" className="form-error">{error}</p>}
        <button type="submit" disabled={loading} className="btn-full">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  )
}
