import { useState, useEffect } from 'react'
import { financeApi } from '../../api'
import styles from './AdminFinance.module.css'

export default function AdminFinance({ loading: parentLoading }) {
  const [revenue, setRevenue] = useState(null)
  const [unpaid, setUnpaid] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        setError(null)
        const [r, u] = await Promise.allSettled([
          financeApi.getTotalRevenue(),
          financeApi.getUnpaidSubscriptions(),
        ])
        if (r.status === 'fulfilled') setRevenue(r.value)
        if (u.status === 'fulfilled') setUnpaid(Array.isArray(u.value) ? u.value : u.value?.unpaidSubscriptions || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading || parentLoading) return <div className={styles.loading}>Loading reports...</div>
  if (error) return <div className={styles.error}>Error: {error}</div>

  const totalRevenue = revenue?.totalRevenue || 0
  const pendingAmount = unpaid.reduce((acc, sub) => acc + (sub.membershipPlan?.monthlyPrice || 0), 0)

  return (
    <div className={styles.container}>
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Total Revenue</div>
          <div className={styles.cardValue}>${totalRevenue.toFixed(2)}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Pending Payments</div>
          <div className={styles.cardValue}>${pendingAmount.toFixed(2)}</div>
          <div className={styles.cardSub}>{unpaid.length} subscriptions</div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Unpaid Subscriptions</h3>
        {unpaid.length === 0 ? (
          <p className={styles.empty}>All subscriptions are paid!</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {unpaid.map(sub => (
                <tr key={sub.id}>
                  <td>{sub.member?.user?.username || 'Unknown'}</td>
                  <td>{sub.membershipPlan?.title || 'Unknown Plan'}</td>
                  <td>${sub.membershipPlan?.monthlyPrice?.toFixed(2) || '0.00'}</td>
                  <td><span className={styles.badge}>Unpaid</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
