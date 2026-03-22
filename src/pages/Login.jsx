import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api'
import { Input, Button, Alert } from '../components/UI'
import styles from './Auth.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Please fill in all fields.')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Please enter a valid email address.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')

    setLoading(true)
    try {
      const data = await authApi.login(form)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Left Panel */}
      <div className={styles.left}>
        <div className={styles.leftGrid} />
        <div className={styles.leftGlow} />
        <div className={styles.leftTop}>
          <Link to="/" className={styles.logo}>IRON<span>FORGE</span></Link>
          <h2 className={styles.leftTitle}>Welcome<br />Back <span className={styles.dot}>.</span></h2>
          <p className={styles.leftSub}>You are only a few seconds away from your coach, your program, and your progress data.</p>
        </div>
        <div className={styles.testimonial}>
          <p className={styles.tQuote}>"Thanks to IronForge, I reached my goal in 3 months. Coach coordination and progress tracking became incredibly easy."</p>
          <div className={styles.tAuthor}>
            <div className={styles.tAvatar}>AK</div>
            <div>
              <div className={styles.tName}>Ahmet K.</div>
              <div className={styles.tRole}>Pro Plan Member</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.right}>
        <Link to="/" className={styles.backHome}>← Home</Link>
        <div className={styles.formBox}>
          <h1 className={styles.formTitle}>Sign In</h1>
          <p className={styles.formSub}>Don't have an account? <Link to="/register">Create one for free</Link></p>

          {error && <Alert type="error">{error}</Alert>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Email"
              id="email"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={set('email')}
              autoComplete="email"
            />
            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              autoComplete="current-password"
            />
            <div className={styles.optionsRow}>
              <label className={styles.rememberLabel}>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className={styles.forgot}>Forgot password</a>
            </div>
            <Button type="submit" size="lg" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
