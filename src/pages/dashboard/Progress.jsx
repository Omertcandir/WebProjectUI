import { useState } from 'react'
import { Card, CardHeader, CardBody, Input, Button, Alert, Spinner } from '../../components/UI'
import styles from './Progress.module.css'

const FIELDS = [
  { id: 'weight',            label: 'Kilo (kg)',      placeholder: '75.5' },
  { id: 'height',            label: 'Boy (cm)',       placeholder: '178' },
  { id: 'chest',             label: 'Göğüs (cm)',     placeholder: '95' },
  { id: 'waist',             label: 'Bel (cm)',       placeholder: '80' },
  { id: 'hip',               label: 'Kalça (cm)',     placeholder: '98' },
  { id: 'bodyFatPercentage', label: 'Vücut Yağ %',   placeholder: '18.5' },
]

export default function Progress({ data = [], loading, onSubmit }) {
  const [form, setForm] = useState({})
  const [status, setStatus] = useState(null) // { type, msg }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    const body = {}
    FIELDS.forEach(f => { if (form[f.id]) body[f.id] = parseFloat(form[f.id]) })
    try {
      await onSubmit(body)
      setStatus({ type: 'success', msg: '✓ Ölçüm kaydedildi!' })
      setForm({})
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Kaydedilemedi.' })
    }
  }

  const recent = data.slice().reverse().slice(0, 8)

  return (
    <div className={styles.grid}>
      {/* Form */}
      <Card>
        <CardHeader>Yeni Ölçüm Ekle</CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fields}>
              {FIELDS.map(f => (
                <Input
                  key={f.id} id={f.id} label={f.label}
                  type="number" placeholder={f.placeholder}
                  value={form[f.id] || ''} onChange={set(f.id)}
                />
              ))}
            </div>
            {status && <Alert type={status.type}>{status.msg}</Alert>}
            <Button type="submit" size="md" fullWidth>Kaydet</Button>
          </form>
        </CardBody>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>Son Ölçümler</CardHeader>
        <CardBody>
          {loading ? <Spinner /> : recent.length === 0
            ? <p className={styles.empty}>Henüz ölçüm yok.</p>
            : recent.map((item, i) => (
              <div key={i} className={styles.histRow}>
                <div className={styles.histDate}>{item.date || '—'}</div>
                <div className={styles.histChips}>
                  {item.weight || item.bodyWeight
                    ? <span className={styles.chip}>{item.weight || item.bodyWeight} kg</span> : null}
                  {item.bodyFatPercentage || item.bodyFat
                    ? <span className={styles.chip}>{item.bodyFatPercentage || item.bodyFat}% yağ</span> : null}
                  {item.waist || item.waistCm
                    ? <span className={styles.chip}>{item.waist || item.waistCm} bel</span> : null}
                </div>
              </div>
            ))
          }
        </CardBody>
      </Card>
    </div>
  )
}
