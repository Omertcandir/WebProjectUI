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
        <li><a href="#plans">Plans</a></li>
        <li><a href="#features">Features</a></li>
      </ul>

      <div className={styles.actions}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className={styles.btnGhost}>Dashboard</Link>
            <button className={styles.btnPrimary} onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.btnGhost}>Sign In</Link>
            <Link to="/register" className={styles.btnPrimary}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
