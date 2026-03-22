import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        IRON<span>FORGE</span>
      </Link>

      <ul className={styles.links}>
        <li><a href="#plans">Planlar</a></li>
        <li><a href="#features">Özellikler</a></li>
        <li><a href="#roles">Roller</a></li>
      </ul>

      <div className={styles.actions}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className={styles.btnGhost}>Dashboard</Link>
            <button className={styles.btnPrimary} onClick={handleLogout}>Çıkış Yap</button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.btnGhost}>Giriş Yap</Link>
            <Link to="/register" className={styles.btnPrimary}>Üye Ol</Link>
          </>
        )}
      </div>
    </nav>
  )
}
