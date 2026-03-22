import { Badge, Card, CardHeader, CardBody, Button, Spinner } from '../../components/UI'
import styles from './Sessions.module.css'

export default function Sessions({ sessions = [], loading, onComplete }) {
  return (
    <Card>
      <CardHeader>
        <span>Antrenman Seansları</span>
        <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-body)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
          {sessions.length} seans
        </span>
      </CardHeader>
      <CardBody>
        {loading ? <Spinner /> : sessions.length === 0
          ? <p className={styles.empty}>Henüz antrenman seansı yok.</p>
          : sessions.map(s => {
            const done = s.completed || s.status === 'COMPLETED'
            return (
              <div key={s.id} className={styles.row}>
                <div className={styles.num}>{String(s.id || '?').slice(-2)}</div>
                <div className={styles.info}>
                  <div className={styles.name}>{s.name || s.programName || 'Antrenman Seansı'}</div>
                  <div className={styles.meta}>
                    {s.scheduledDate || s.date || '—'}
                    {s.durationMinutes ? ` · ${s.durationMinutes} dk` : ''}
                    {s.exerciseCount   ? ` · ${s.exerciseCount} egzersiz` : ''}
                  </div>
                </div>
                <Badge color={done ? 'green' : 'yellow'}>
                  {done ? 'Tamamlandı' : 'Bekliyor'}
                </Badge>
                {!done && (
                  <Button variant="success" size="sm" onClick={() => onComplete(s.id)}>
                    Tamamla ✓
                  </Button>
                )}
              </div>
            )
          })
        }
      </CardBody>
    </Card>
  )
}
