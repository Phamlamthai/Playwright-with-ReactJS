import { useState, type SubmitEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../services/api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const user = await authApi.register({ name, email, password, role: 'member' })
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
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label><br />
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>
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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}
