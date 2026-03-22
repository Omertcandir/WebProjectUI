import { Card, CardHeader, CardBody, Button, Spinner } from '../../components/UI'
import styles from './Plans.module.css'

export default function Plans({ plans = [], loading, onSelect }) {
  return (
    <Card>
      <CardHeader>Üyelik Planları</CardHeader>
      <CardBody>
        {loading ? <Spinner /> : plans.length === 0
          ? <p className={styles.empty}>Plan bulunamadı.</p>
          : plans.map(p => (
            <div key={p.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.name}>{p.name || 'Plan'}</div>
                <div className={styles.desc}>{p.description || ''}</div>
              </div>
              <div className={styles.right}>
                <div className={styles.price}>
                  <span className={styles.currency}>₺</span>
                  {p.price || p.monthlyFee || '—'}
                  <span className={styles.per}>/ay</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onSelect(p.id)}>Seç</Button>
              </div>
            </div>
          ))
        }
      </CardBody>
    </Card>
  )
}
