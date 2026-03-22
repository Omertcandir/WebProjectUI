import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { workoutsApi, subscriptionsApi, progressApi } from '../api'
import Sidebar from '../components/Sidebar'
import Overview  from './dashboard/Overview'
import Sessions  from './dashboard/Sessions'
import Plans     from './dashboard/Plans'
import Progress  from './dashboard/Progress'
import AdminFinance from './dashboard/AdminFinance'
import AdminPlans from './dashboard/AdminPlans'
import AdminMembers from './dashboard/AdminMembers'
import AdminStaff from './dashboard/AdminStaff'
import TrainerPrograms from './dashboard/TrainerPrograms'
import TrainerExercises from './dashboard/TrainerExercises'
import TrainerMembers from './dashboard/TrainerMembers'
import TrainerFinance from './dashboard/TrainerFinance'
import styles from './Dashboard.module.css'

const PAGE_TITLES = {
  overview: { title: 'Dashboard',            sub: 'General overview and recent activity' },
  sessions: { title: 'Workout Sessions',  sub: 'All your sessions and statuses' },
  programs: { title: 'Programs',           sub: 'Programs prepared by your trainer' },
  plans:    { title: 'Membership Plans',      sub: 'Available plans and options' },
  progress: { title: 'Progress Tracking',      sub: 'Save your measurements and view your chart' },
  'admin-finance': { title: 'Financial Reports', sub: 'Revenue and subscription insights' },
  'admin-plans': { title: 'Membership Plans', sub: 'Create and manage plans' },
  'admin-members': { title: 'Members', sub: 'Manage member accounts' },
  'admin-staff': { title: 'Staff Management', sub: 'Create and manage staff' },
  'trainer-programs': { title: 'Workout Programs', sub: 'Create programs for members' },
  'trainer-exercises': { title: 'Exercise Library', sub: 'Manage exercise database' },
  'trainer-members': { title: 'Members', sub: 'Manage member plans' },
  'trainer-finance': { title: 'Unpaid Reports', sub: 'Track unpaid subscriptions' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const [page, setPage]         = useState('overview')
  const [sessions,  setSessions]  = useState([])
  const [plans,     setPlans]     = useState([])
  const [progress,  setProgress]  = useState([])
  const [loading,   setLoading]   = useState(true)

  const memberId = user?.memberId || user?.MemberId || null
  const rawRole = user?.role
  const role = typeof rawRole === 'number'
    ? ({ 1: 'ADMIN', 2: 'TRAINER', 3: 'MEMBER' }[rawRole] || '')
    : String(rawRole || '').toUpperCase()
  const canCompleteSession = role === 'ADMIN' || role === 'TRAINER'
  const canSelectPlan = role === 'MEMBER'

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [s, p, pr] = await Promise.allSettled([
        memberId && role === 'MEMBER'
          ? workoutsApi.getMemberSessions(memberId)
          : Promise.resolve([]),
        subscriptionsApi.getPlans(),
        memberId && role === 'MEMBER'
          ? progressApi.getChart(memberId)
          : Promise.resolve([]),
      ])
      const arr = (v) => Array.isArray(v) ? v : (v?.content || v?.sessions || v?.measurements || v?.data || [])
      if (s.status  === 'fulfilled') setSessions(arr(s.value))
      if (p.status  === 'fulfilled') setPlans(arr(p.value))
      if (pr.status === 'fulfilled') setProgress(arr(pr.value))
    } finally {
      setLoading(false)
    }
  }, [memberId, role])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleCompleteSession = async (sessionId) => {
    const selected = sessions.find(s => s.id === sessionId)
    await workoutsApi.completeSession(sessionId, {
      durationMinutes: Math.max(1, selected?.durationMinutes || 60),
      notes: selected?.notes || 'Completed from frontend',
    })
    fetchAll()
  }

  const handleSelectPlan = async (planId) => {
    await subscriptionsApi.selectPlan({ membershipPlanId: planId })
    alert('Plan selected!')
    fetchAll()
  }

  const handleSubmitProgress = async (body) => {
    await progressApi.addMeasurement({ ...body, memberId, measurementDate: new Date().toISOString() })
    fetchAll()
  }

  const { title, sub } = PAGE_TITLES[page] || PAGE_TITLES.overview

  return (
    <div className={styles.layout}>
      <Sidebar active={page} onNav={setPage} />
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>{title}</h1>
            <p className={styles.pageSub}>{page === 'overview'
              ? `Welcome, ${(user?.firstName || user?.username || 'User').split(' ')[0]}! 💪`
              : sub}
            </p>
          </div>
        </header>

        <div className={styles.content}>
          {/* Member Pages */}
          {page === 'overview' && (
            <Overview sessions={sessions} plans={plans} progress={progress} loading={loading} />
          )}
          {page === 'sessions' && (
            <Sessions sessions={sessions} loading={loading} onComplete={handleCompleteSession} canComplete={canCompleteSession} />
          )}
          {page === 'plans' && (
            <Plans plans={plans} loading={loading} onSelect={handleSelectPlan} canSelect={canSelectPlan} />
          )}
          {page === 'progress' && (
            <Progress data={progress} loading={loading} onSubmit={handleSubmitProgress} />
          )}
          {page === 'programs' && (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>📋</div>
              <h3>Programs</h3>
              <p>Programs prepared by your trainer will appear here.</p>
            </div>
          )}

          {/* Admin Pages */}
          {page === 'admin-finance' && <AdminFinance loading={loading} />}
          {page === 'admin-plans' && <AdminPlans plans={plans} onRefresh={fetchAll} />}
          {page === 'admin-members' && <AdminMembers />}
          {page === 'admin-staff' && <AdminStaff />}

          {/* Trainer Pages */}
          {page === 'trainer-programs' && <TrainerPrograms />}
          {page === 'trainer-exercises' && <TrainerExercises />}
          {page === 'trainer-members' && <TrainerMembers />}
          {page === 'trainer-finance' && <TrainerFinance />}
        </div>
      </main>
    </div>
  )
}
