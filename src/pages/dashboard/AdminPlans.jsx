import { useState } from 'react'
import { subscriptionsApi } from '../../api'
import styles from './AdminPlans.module.css'

export default function AdminPlans({ plans, onRefresh }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    monthlyPrice: '',
    durationInMonths: '',
    canFreeze: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      await subscriptionsApi.createPlan({
        ...formData,
        monthlyPrice: parseFloat(formData.monthlyPrice),
        durationInMonths: parseInt(formData.durationInMonths),
      })
      alert('Plan created successfully!')
      setFormData({
        title: '',
        description: '',
        monthlyPrice: '',
        durationInMonths: '',
        canFreeze: false,
      })
      setShowForm(false)
      onRefresh?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Membership Plans</h2>
        <button className={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Create Plan'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Plan Title (e.g., Basic, Premium)"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            />
            <input
              type="number"
              name="monthlyPrice"
              placeholder="Monthly Price"
              value={formData.monthlyPrice}
              onChange={handleInputChange}
              step="0.01"
              required
            />
            <input
              type="number"
              name="durationInMonths"
              placeholder="Duration (months)"
              value={formData.durationInMonths}
              onChange={handleInputChange}
              required
            />
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="canFreeze"
                checked={formData.canFreeze}
                onChange={handleInputChange}
              />
              Allow members to freeze membership
            </label>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Creating...' : 'Create Plan'}
            </button>
          </form>
        </div>
      )}

      <div className={styles.grid}>
        {plans && plans.length > 0 ? (
          plans.map(plan => (
            <div key={plan.id} className={styles.planCard}>
              <div className={styles.planTitle}>{plan.title}</div>
              <div className={styles.planPrice}>${plan.monthlyPrice?.toFixed(2)}</div>
              <div className={styles.planMeta}>
                <span>{plan.durationInMonths} months</span>
                {plan.canFreeze && <span className={styles.badge}>Freezable</span>}
              </div>
              {plan.description && <p className={styles.planDesc}>{plan.description}</p>}
            </div>
          ))
        ) : (
          <p className={styles.empty}>No plans yet. Create one to get started!</p>
        )}
      </div>
    </div>
  )
}
