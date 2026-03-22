import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { workoutsApi, subscriptionsApi, progressApi } from '../api'
import Sidebar from '../components/Sidebar'
import Overview  from './dashboard/Overview'
import Sessions  from './dashboard/Sessions'
import Plans     from './dashboard/Plans'
import Progress  from './dashboard/Progress'
import styles from './Dashboard.module.css'

const PAGE_TITLES = {
  overview: { title: 'Dashboard',            sub: 'Genel bakış ve son aktiviteler' },
  sessions: { title: 'Antrenman Seansları',  sub: 'Tüm seanslarınız ve durumları' },
  programs: { title: 'Programlar',           sub: 'Antrenörünüz tarafından hazırlanan programlar' },
  plans:    { title: 'Üyelik Planları',      sub: 'Mevcut planlar ve seçenekler' },
  progress: { title: 'İlerleme Takibi',      sub: 'Ölçümlerinizi kaydedin ve grafiği görüntüleyin' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const [page, setPage]         = useState('overview')
  const [sessions,  setSessions]  = useState([])
  const [plans,     setPlans]     = useState([])
  const [progress,  setProgress]  = useState([])
  const [loading,   setLoading]   = useState(true)

  const memberId = user?.id || user?.memberId

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [s, p, pr] = await Promise.allSettled([
        memberId ? workoutsApi.getMemberSessions(memberId) : Promise.resolve([]),
        subscriptionsApi.getPlans(),
        memberId ? progressApi.getChart(memberId) : Promise.resolve([]),
      ])
      const arr = (v) => Array.isArray(v) ? v : (v?.content || v?.sessions || v?.measurements || v?.data || [])
      if (s.status  === 'fulfilled') setSessions(arr(s.value))
      if (p.status  === 'fulfilled') setPlans(arr(p.value))
      if (pr.status === 'fulfilled') setProgress(arr(pr.value))
    } finally {
      setLoading(false)
    }
  }, [memberId])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleCompleteSession = async (sessionId) => {
    await workoutsApi.completeSession(sessionId)
    fetchAll()
  }

  const handleSelectPlan = async (planId) => {
    await subscriptionsApi.selectPlan({ planId, memberId })
    alert('Plan seçildi!')
  }

  const handleSubmitProgress = async (body) => {
    await progressApi.addMeasurement({ ...body, memberId })
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
              ? `Hoş geldin, ${(user?.firstName || user?.username || 'Kullanıcı').split(' ')[0]}! 💪`
              : sub}
            </p>
          </div>
        </header>

        <div className={styles.content}>
          {page === 'overview' && (
            <Overview sessions={sessions} plans={plans} progress={progress} loading={loading} />
          )}
          {page === 'sessions' && (
            <Sessions sessions={sessions} loading={loading} onComplete={handleCompleteSession} />
          )}
          {page === 'plans' && (
            <Plans plans={plans} loading={loading} onSelect={handleSelectPlan} />
          )}
          {page === 'progress' && (
            <Progress data={progress} loading={loading} onSubmit={handleSubmitProgress} />
          )}
          {page === 'programs' && (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>📋</div>
              <h3>Programlar</h3>
              <p>Antrenörünüz tarafından hazırlanan programlar burada görünecek.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
