import { Card, CardHeader, CardBody, Button, Spinner } from '../../components/UI'
import styles from './Plans.module.css'

export default function Plans({ plans = [], loading, onSelect, canSelect = false }) {
  return (
    <Card>
      <CardHeader>Membership Plans</CardHeader>
      <CardBody>
        {loading ? <Spinner /> : plans.length === 0
          ? <p className={styles.empty}>No plans found.</p>
          : plans.map(p => (
            <div key={p.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.name}>{p.title || p.name || 'Plan'}</div>
                <div className={styles.desc}>{p.description || ''}</div>
              </div>
              <div className={styles.right}>
                <div className={styles.price}>
                  <span className={styles.currency}>₺</span>
                  {p.monthlyPrice || p.price || p.monthlyFee || '—'}
                  <span className={styles.per}>/month</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onSelect(p.id)} disabled={!canSelect}>Select</Button>
              </div>
            </div>
          ))
        }
      </CardBody>
    </Card>
  )
}
