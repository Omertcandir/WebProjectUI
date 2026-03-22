import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api'
import { Input, Button, Alert } from '../components/UI'
import styles from './Auth.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.password) return setError('Lütfen tüm alanları doldurun.')

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
          <h2 className={styles.leftTitle}>Geri<br />Döndün <span className={styles.dot}>.</span></h2>
          <p className={styles.leftSub}>Antrenörün, programın ve ilerleme verilerinden sadece birkaç saniye uzaktasın.</p>
        </div>
        <div className={styles.testimonial}>
          <p className={styles.tQuote}>"IronForge sayesinde 3 ayda hedefime ulaştım. Antrenörümle koordinasyon ve ilerleme takibi inanılmaz kolaylaştı."</p>
          <div className={styles.tAuthor}>
            <div className={styles.tAvatar}>AK</div>
            <div>
              <div className={styles.tName}>Ahmet K.</div>
              <div className={styles.tRole}>Pro Plan Üyesi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.right}>
        <Link to="/" className={styles.backHome}>← Ana Sayfa</Link>
        <div className={styles.formBox}>
          <h1 className={styles.formTitle}>Giriş Yap</h1>
          <p className={styles.formSub}>Hesabın yok mu? <Link to="/register">Ücretsiz kayıt ol</Link></p>

          {error && <Alert type="error">{error}</Alert>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="E-posta veya Kullanıcı Adı"
              id="username"
              type="text"
              placeholder="ornek@eposta.com"
              value={form.username}
              onChange={set('username')}
              autoComplete="username"
            />
            <Input
              label="Şifre"
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              autoComplete="current-password"
            />
            <div className={styles.optionsRow}>
              <label className={styles.rememberLabel}>
                <input type="checkbox" /> Beni hatırla
              </label>
              <a href="#" className={styles.forgot}>Şifremi unuttum</a>
            </div>
            <Button type="submit" size="lg" fullWidth loading={loading}>
              Giriş Yap
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
