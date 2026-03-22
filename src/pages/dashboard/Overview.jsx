import { Badge, Card, CardHeader, CardBody, Spinner } from '../../components/UI'
import styles from './Overview.module.css'

function StatCard({ label, value, accent, sub }) {
  return (
    <div className={`${styles.statCard} ${styles[`accent_${accent}`]}`}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value ?? '—'}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  )
}

export default function Overview({ sessions = [], plans = [], progress = [], loading }) {
  const total     = sessions.length
  const completed = sessions.filter(s => s.completed || s.status === 'COMPLETED').length
  const planName  = plans[0]?.name || '—'
  const measures  = progress.length

  const recent = sessions.slice(0, 4)

  return (
    <div className={styles.wrap}>
      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard label="Toplam Seans"    value={total}     accent="orange" sub="Bu ay" />
        <StatCard label="Tamamlanan"      value={completed} accent="green"  sub="✓ Tamamlandı" />
        <StatCard label="Aktif Plan"      value={planName}  accent="blue"   />
        <StatCard label="İlerleme Kaydı" value={measures}  accent="purple" sub="Ölçüm" />
      </div>

      {/* Content grid */}
      <div className={styles.contentGrid}>
        {/* Recent sessions */}
        <Card>
          <CardHeader>Son Seanslar</CardHeader>
          <CardBody>
            {loading ? <Spinner /> : recent.length === 0
              ? <p className={styles.empty}>Henüz antrenman seansı yok.</p>
              : recent.map(s => (
                <div key={s.id} className={styles.sessionRow}>
                  <div className={styles.sessionNum}>{String(s.id || '?').slice(-2)}</div>
                  <div className={styles.sessionInfo}>
                    <div className={styles.sessionName}>{s.name || s.programName || 'Antrenman Seansı'}</div>
                    <div className={styles.sessionMeta}>{s.scheduledDate || s.date || '—'} · {s.durationMinutes || '—'} dk</div>
                  </div>
                  <Badge color={s.completed || s.status === 'COMPLETED' ? 'green' : 'yellow'}>
                    {s.completed || s.status === 'COMPLETED' ? 'Tamamlandı' : 'Bekliyor'}
                  </Badge>
                </div>
              ))
            }
          </CardBody>
        </Card>

        {/* Progress summary */}
        <Card>
          <CardHeader>İlerleme Özeti</CardHeader>
          <CardBody>
            {loading ? <Spinner /> : (
              <>
                <MiniChart data={progress} />
                <LatestMeasure data={progress[progress.length - 1]} />
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

function MiniChart({ data }) {
  const items = data.slice(-8)
  if (!items.length) return <p className={styles.empty}>Grafik verisi yok.</p>
  const maxW = Math.max(...items.map(i => i.weight || i.bodyWeight || 0), 1)
  return (
    <div className={styles.chart}>
      {items.map((item, idx) => {
        const w = item.weight || item.bodyWeight || 0
        const h = Math.round((w / maxW) * 88)
        const label = (item.date || '').slice(5, 7)
        return (
          <div key={idx} className={styles.chartCol}>
            <div className={styles.chartBar} style={{ height: h }} />
            <div className={styles.chartLabel}>{label || '?'}</div>
          </div>
        )
      })}
    </div>
  )
}

function LatestMeasure({ data }) {
  if (!data) return <p className={styles.empty} style={{ marginTop: 16 }}>Henüz ölçüm yok.</p>
  const items = [
    { key: 'Kilo',   val: data.weight || data.bodyWeight,   unit: 'kg' },
    { key: 'Yağ %',  val: data.bodyFatPercentage || data.bodyFat, unit: '%' },
    { key: 'Bel',    val: data.waist || data.waistCm,        unit: 'cm' },
    { key: 'Göğüs',  val: data.chest || data.chestCm,        unit: 'cm' },
  ]
  return (
    <div className={styles.measureGrid}>
      {items.map(i => (
        <div key={i.key} className={styles.measureItem}>
          <div className={styles.measureKey}>{i.key}</div>
          <div className={styles.measureVal}>{i.val ?? '—'}<small> {i.unit}</small></div>
        </div>
      ))}
    </div>
  )
}
