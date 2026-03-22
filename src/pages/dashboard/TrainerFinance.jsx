import { useState, useEffect } from 'react'
import { financeApi } from '../../api'
import styles from './TrainerFinance.module.css'

export default function TrainerFinance() {
  const [unpaid, setUnpaid] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const data = await financeApi.getUnpaidSubscriptions()
        setUnpaid(Array.isArray(data) ? data : data?.unpaidSubscriptions || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <div className={styles.loading}>Loading reports...</div>
  if (error) return <div className={styles.error}>Error: {error}</div>

  const pendingAmount = unpaid.reduce((acc, sub) => acc + (sub.membershipPlan?.monthlyPrice || 0), 0)

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Unpaid Subscriptions</div>
          <div className={styles.cardValue}>{unpaid.length}</div>
          <div className={styles.cardSub}>Total: ${pendingAmount.toFixed(2)}</div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Members with Unpaid Plans</h3>
        {unpaid.length === 0 ? (
          <p className={styles.empty}>All members have paid subscriptions! 🎉</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Plan</th>
                  <th>Amount Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {unpaid.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.member?.user?.username || 'Unknown'}</td>
                    <td>{sub.membershipPlan?.title || 'Unknown Plan'}</td>
                    <td className={styles.amount}>${sub.membershipPlan?.monthlyPrice?.toFixed(2) || '0.00'}</td>
                    <td><span className={styles.badge}>Unpaid</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.info}>
        <p>💡 Follow up with members who have unpaid subscriptions to ensure timely payments</p>
      </div>
    </div>
  )
}
