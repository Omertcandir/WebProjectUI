import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import { Input, Button, Alert } from '../components/UI'
import styles from './Auth.module.css'

function PasswordStrength({ value }) {
  let score = 0
  if (value.length >= 8) score++
  if (/[A-Z]/.test(value)) score++
  if (/[0-9]/.test(value)) score++
  if (/[^A-Za-z0-9]/.test(value)) score++
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e']
  const color = value ? colors[score] : 'var(--border)'
  return (
    <div className={styles.strengthBars}>
      {[1,2,3,4].map(i => (
        <div key={i} className={styles.strengthBar}
          style={{ background: i <= score ? color : 'var(--border)' }} />
      ))}
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', passwordConfirm: ''
  })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [terms, setTerms]     = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    const { name, email, password, passwordConfirm } = form
    if (!name || !email || !password)
      return setError('Please fill in all fields.')
    if (name.trim().length < 2)
      return setError('Full name must be at least 2 characters.')
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setError('Please enter a valid email address.')
    if (password !== passwordConfirm)
      return setError('Passwords do not match.')
    if (password.length < 8)
      return setError('Password must be at least 8 characters.')
    if (!terms)
      return setError('You must accept the terms of use.')

    setLoading(true)
    try {
      await authApi.register({ name: name.trim(), email: email.trim(), password })
      setSuccess('Your account has been created. Redirecting to sign in...')
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Left Panel */}
      <div className={`${styles.left} ${styles.leftNarrow}`}>
        <div className={styles.leftGrid} />
        <div className={styles.leftGlow} style={{ top: '-100px', right: '-100px', bottom: 'auto' }} />
        <div className={styles.leftTop}>
          <Link to="/" className={styles.logo}>IRON<span>FORGE</span></Link>
          <h2 className={styles.leftTitle}>Join<br /><span className={styles.accent}>Us</span></h2>
          <p className={styles.leftSub}>Sign up for the world's best fitness platform. Your first week is completely free.</p>
        </div>
        <div className={styles.perksList}>
          {[
            { icon: '⚡', title: 'Personal Coach', desc: 'Get matched with a coach aligned to your goals' },
            { icon: '📊', title: 'Progress Tracking', desc: 'Track your measurements and improvements visually' },
            { icon: '🏋️', title: 'Custom Programs', desc: 'Personalized workout sessions and programs' },
          ].map(p => (
            <div key={p.title} className={styles.perkItem}>
              <div className={styles.perkIcon}>{p.icon}</div>
              <div>
                <div className={styles.perkTitle}>{p.title}</div>
                <div className={styles.perkDesc}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className={`${styles.right} ${styles.rightScroll}`}>
        <Link to="/" className={styles.backHome}>← Home</Link>
        <div className={styles.formBox}>
          <h1 className={styles.formTitle}>Create Account</h1>
          <p className={styles.formSub}>Already have an account? <Link to="/login">Sign in</Link></p>

          {error   && <Alert type="error">{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.sectionDivider}>Personal Information</div>
            <Input label="Full Name" id="name" placeholder="Alex Johnson" value={form.name} onChange={set('name')} />
            <Input label="Email Address" id="email"    type="email" placeholder="alex@email.com" value={form.email}    onChange={set('email')} />

            <div className={styles.sectionDivider}>Security</div>
            <div className={styles.passwordField}>
              <Input label="Password" id="password" type="password" placeholder="At least 8 characters" value={form.password} onChange={set('password')} />
              <PasswordStrength value={form.password} />
            </div>
            <Input label="Confirm Password" id="passwordConfirm" type="password" placeholder="Repeat your password" value={form.passwordConfirm} onChange={set('passwordConfirm')} />

            <label className={styles.termsRow}>
              <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} />
              <span>I accept the <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.</span>
            </label>

            <Button type="submit" size="lg" fullWidth loading={loading}>
              Sign Up for Free
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
