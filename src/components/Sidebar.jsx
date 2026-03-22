import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Sidebar.module.css'

const NAV_MEMBER = [
  { section: 'General',     items: [{ key: 'overview', icon: '⊞', label: 'Dashboard' }] },
  { section: 'Workouts', items: [
    { key: 'sessions', icon: '⚡', label: 'My Sessions' },
    { key: 'programs', icon: '📋', label: 'Programs' },
  ]},
  { section: 'Membership',    items: [{ key: 'plans', icon: '💳', label: 'Plans' }] },
  { section: 'Progress',   items: [{ key: 'progress', icon: '📊', label: 'Tracking' }] },
]

const NAV_TRAINER = [
  { section: 'General',     items: [{ key: 'overview', icon: '⊞', label: 'Dashboard' }] },
  { section: 'Workouts', items: [
    { key: 'trainer-programs', icon: '📋', label: 'Create Programs' },
    { key: 'trainer-exercises', icon: '🏋️', label: 'Exercises' },
    { key: 'sessions', icon: '⚡', label: 'Sessions' },
  ]},
  { section: 'Members', items: [
    { key: 'trainer-members', icon: '👥', label: 'Members' },
    { key: 'trainer-finance', icon: '💰', label: 'Unpaid Reports' },
  ]},
  { section: 'Progress',   items: [{ key: 'progress', icon: '📊', label: 'Tracking' }] },
]

const NAV_ADMIN = [
  { section: 'General',     items: [{ key: 'overview', icon: '⊞', label: 'Dashboard' }] },
  { section: 'Staff', items: [
    { key: 'admin-staff', icon: '👨‍💼', label: 'Staff Management' },
  ]},
  { section: 'Membership', items: [
    { key: 'admin-plans', icon: '💳', label: 'Plans' },
    { key: 'admin-members', icon: '👥', label: 'Members' },
  ]},
  { section: 'Finance', items: [
    { key: 'admin-finance', icon: '💰', label: 'Reports' },
  ]},
]

export default function Sidebar({ active, onNav }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const rawRole = user?.role
  const role = typeof rawRole === 'number'
    ? ({ 1: 'ADMIN', 2: 'TRAINER', 3: 'MEMBER' }[rawRole] || 'MEMBER')
    : String(rawRole || 'MEMBER').toUpperCase()
  
  const NAV = role === 'ADMIN' ? NAV_ADMIN : role === 'TRAINER' ? NAV_TRAINER : NAV_MEMBER

  const handleLogout = () => { logout(); navigate('/') }

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'User'
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

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
          <button className={styles.logoutBtn} onClick={handleLogout} title="Log out">⏻</button>
        </div>
      </div>
    </aside>
  )
}
