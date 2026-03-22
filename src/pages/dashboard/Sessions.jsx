import { Badge, Card, CardHeader, CardBody, Button, Spinner } from '../../components/UI'
import styles from './Sessions.module.css'

export default function Sessions({ sessions = [], loading, onComplete, canComplete = false }) {
  return (
    <Card>
      <CardHeader>
        <span>Workout Sessions</span>
        <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-body)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
          {sessions.length} sessions
        </span>
      </CardHeader>
      <CardBody>
        {loading ? <Spinner /> : sessions.length === 0
          ? <p className={styles.empty}>No workout sessions yet.</p>
          : sessions.map(s => {
            const done = s.completed || s.status === 'COMPLETED' || s.status === 'Completed' || s.status === 2
            return (
              <div key={s.id} className={styles.row}>
                <div className={styles.num}>{String(s.id || '?').slice(-2)}</div>
                <div className={styles.info}>
                  <div className={styles.name}>{s.name || s.programName || 'Workout Session'}</div>
                  <div className={styles.meta}>
                    {s.scheduledDate || s.date || '—'}
                    {s.durationMinutes ? ` · ${s.durationMinutes} min` : ''}
                    {s.exerciseCount   ? ` · ${s.exerciseCount} exercises` : ''}
                  </div>
                </div>
                <Badge color={done ? 'green' : 'yellow'}>
                  {done ? 'Completed' : 'Pending'}
                </Badge>
                {!done && canComplete && (
                  <Button variant="success" size="sm" onClick={() => onComplete(s.id)}>
                    Complete ✓
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
