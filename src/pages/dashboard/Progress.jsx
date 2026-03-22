import { useState } from 'react'
import { Card, CardHeader, CardBody, Input, Button, Alert, Spinner } from '../../components/UI'
import styles from './Progress.module.css'

const FIELDS = [
  { id: 'weight',            label: 'Weight (kg)',    placeholder: '75.5', min: 1, max: 1000 },
  { id: 'height',            label: 'Height (cm)',     placeholder: '178', min: 30, max: 300 },
  { id: 'bodyFatPercentage', label: 'Body Fat %', placeholder: '18.5', min: 0, max: 100 },
  { id: 'chest',             label: 'Chest (cm)',   placeholder: '95', min: 0, max: 500 },
  { id: 'waist',             label: 'Waist (cm)',     placeholder: '80', min: 0, max: 500 },
  { id: 'arm',               label: 'Arm (cm)',     placeholder: '34', min: 0, max: 500 },
  { id: 'leg',               label: 'Leg (cm)',   placeholder: '56', min: 0, max: 500 },
]

export default function Progress({ data = [], loading, onSubmit }) {
  const [form, setForm] = useState({})
  const [status, setStatus] = useState(null) // { type, msg }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    const body = {}
    for (const field of FIELDS) {
      const raw = form[field.id]
      if (raw === undefined || raw === '') {
        setStatus({ type: 'error', msg: 'Please fill in all measurement fields.' })
        return
      }
      const value = parseFloat(raw)
      if (Number.isNaN(value)) {
        setStatus({ type: 'error', msg: `Enter a valid number for ${field.label}.` })
        return
      }
      if (value < field.min || value > field.max) {
        setStatus({ type: 'error', msg: `${field.label} must be between ${field.min}-${field.max}.` })
        return
      }
      body[field.id] = value
    }

    try {
      await onSubmit(body)
      setStatus({ type: 'success', msg: '✓ Measurement saved.' })
      setForm({})
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Could not save.' })
    }
  }

  const recent = data.slice().reverse().slice(0, 8)

  return (
    <div className={styles.grid}>
      {/* Form */}
      <Card>
        <CardHeader>Add New Measurement</CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fields}>
              {FIELDS.map(f => (
                <Input
                  key={f.id} id={f.id} label={f.label}
                  type="number" placeholder={f.placeholder}
                  min={f.min}
                  max={f.max}
                  step="0.1"
                  value={form[f.id] || ''} onChange={set(f.id)}
                />
              ))}
            </div>
            {status && <Alert type={status.type}>{status.msg}</Alert>}
            <Button type="submit" size="md" fullWidth>Save</Button>
          </form>
        </CardBody>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>Recent Measurements</CardHeader>
        <CardBody>
          {loading ? <Spinner /> : recent.length === 0
            ? <p className={styles.empty}>No measurements yet.</p>
            : recent.map((item, i) => (
              <div key={i} className={styles.histRow}>
                <div className={styles.histDate}>{item.date || '—'}</div>
                <div className={styles.histChips}>
                  {item.weight || item.bodyWeight
                    ? <span className={styles.chip}>{item.weight || item.bodyWeight} kg</span> : null}
                  {item.bodyFatPercentage || item.bodyFat
                    ? <span className={styles.chip}>{item.bodyFatPercentage || item.bodyFat}% fat</span> : null}
                  {item.waist || item.waistCm
                    ? <span className={styles.chip}>{item.waist || item.waistCm} waist</span> : null}
                </div>
              </div>
            ))
          }
        </CardBody>
      </Card>
    </div>
  )
}
