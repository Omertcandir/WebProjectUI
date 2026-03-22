import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import { Input, Select, Button, Alert } from '../components/UI'
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
    firstName: '', lastName: '', email: '',
    username: '', password: '', passwordConfirm: '', role: 'MEMBER'
  })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [terms, setTerms]     = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    const { firstName, lastName, email, username, password, passwordConfirm, role } = form
    if (!firstName || !lastName || !email || !username || !password)
      return setError('Lütfen tüm alanları doldurun.')
    if (password !== passwordConfirm)
      return setError('Şifreler eşleşmiyor.')
    if (password.length < 8)
      return setError('Şifre en az 8 karakter olmalıdır.')
    if (!terms)
      return setError('Kullanım şartlarını kabul etmelisiniz.')

    setLoading(true)
    try {
      await authApi.register({ firstName, lastName, email, username, password, role })
      setSuccess('Hesabınız oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...')
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
          <h2 className={styles.leftTitle}>Katıl<br /><span className={styles.accent}>Bize</span></h2>
          <p className={styles.leftSub}>Dünyanın en iyi fitness platformuna üye ol. İlk haftan tamamen ücretsiz.</p>
        </div>
        <div className={styles.perksList}>
          {[
            { icon: '⚡', title: 'Kişisel Antrenör', desc: 'Hedeflerine uygun antrenörle eşleştirilirsin' },
            { icon: '📊', title: 'İlerleme Takibi', desc: 'Ölçümlerini ve gelişimini görsel olarak izle' },
            { icon: '🏋️', title: 'Özel Programlar', desc: 'Sana özel antrenman seansları ve programlar' },
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
        <Link to="/" className={styles.backHome}>← Ana Sayfa</Link>
        <div className={styles.formBox}>
          <h1 className={styles.formTitle}>Hesap Oluştur</h1>
          <p className={styles.formSub}>Zaten hesabın var mı? <Link to="/login">Giriş yap</Link></p>

          {error   && <Alert type="error">{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.sectionDivider}>Kişisel Bilgiler</div>
            <div className={styles.row2}>
              <Input label="Ad"     id="firstName" placeholder="Ahmet"  value={form.firstName} onChange={set('firstName')} />
              <Input label="Soyad"  id="lastName"  placeholder="Yılmaz" value={form.lastName}  onChange={set('lastName')} />
            </div>
            <Input label="E-posta Adresi" id="email"    type="email" placeholder="ahmet@eposta.com" value={form.email}    onChange={set('email')} />
            <Input label="Kullanıcı Adı"  id="username"             placeholder="ahmetyilmaz"      value={form.username} onChange={set('username')} />

            <div className={styles.sectionDivider}>Güvenlik</div>
            <div className={styles.passwordField}>
              <Input label="Şifre" id="password" type="password" placeholder="En az 8 karakter" value={form.password} onChange={set('password')} />
              <PasswordStrength value={form.password} />
            </div>
            <Input label="Şifre Tekrar" id="passwordConfirm" type="password" placeholder="Şifreni tekrarla" value={form.passwordConfirm} onChange={set('passwordConfirm')} />

            <div className={styles.sectionDivider}>Tercihler</div>
            <Select label="Rol" id="role" value={form.role} onChange={set('role')}>
              <option value="MEMBER">Üye (Member)</option>
              <option value="TRAINER">Antrenör (Trainer)</option>
            </Select>

            <label className={styles.termsRow}>
              <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} />
              <span><a href="#">Kullanım Şartları</a>'nı ve <a href="#">Gizlilik Politikası</a>'nı kabul ediyorum.</span>
            </label>

            <Button type="submit" size="lg" fullWidth loading={loading}>
              Ücretsiz Kayıt Ol
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
