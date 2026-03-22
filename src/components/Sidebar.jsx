import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Sidebar.module.css'

const NAV = [
  { section: 'Genel',     items: [{ key: 'overview', icon: '⊞', label: 'Dashboard' }] },
  { section: 'Antrenman', items: [
    { key: 'sessions', icon: '⚡', label: 'Seanslarım' },
    { key: 'programs', icon: '📋', label: 'Programlar' },
  ]},
  { section: 'Üyelik',    items: [{ key: 'plans', icon: '💳', label: 'Planlar' }] },
  { section: 'Gelişim',   items: [{ key: 'progress', icon: '📊', label: 'İlerleme' }] },
]

export default function Sidebar({ active, onNav }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Kullanıcı'
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const role = user?.role || 'MEMBER'

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>IRON<span>FORGE</span></div>

      {NAV.map(group => (
        <div key={group.section}>
          <div className={styles.sectionLabel}>{group.section}</div>
          {group.items.map(item => (
            <button
              key={item.key}
              className={`${styles.navItem} ${active === item.key ? styles.active : ''}`}
              onClick={() => onNav(item.key)}
            >
              <span className={styles.icon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      ))}

      <div className={styles.bottom}>
        <div className={styles.userChip}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{name}</div>
            <div className={styles.userRole}>{role}</div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Çıkış">⏻</button>
        </div>
      </div>
    </aside>
  )
}
