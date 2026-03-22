import { useState, useEffect } from 'react'
import { membersApi } from '../../api'
import styles from './AdminMembers.module.css'

const STATUS_LABELS = { 1: 'Active', 2: 'Expired', 3: 'Frozen', 4: 'Cancelled' }
const STATUS_OPTIONS = [
  { value: 1, label: 'Active' },
  { value: 2, label: 'Expired' },
  { value: 3, label: 'Frozen' },
  { value: 4, label: 'Cancelled' },
]

export default function AdminMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingMemberId, setUpdatingMemberId] = useState(null)

  const loadMembers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await membersApi.getAllMembers()
      const membersList = Array.isArray(data) ? data : []
      setMembers(membersList)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const handleFreeze = async (memberId) => {
    if (!confirm('Freeze this member membership?')) return
    try {
      setUpdatingMemberId(memberId)
      await membersApi.freezeMember(memberId)
      alert('Member frozen successfully!')
      await loadMembers()
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setUpdatingMemberId(null)
    }
  }

  const handleStatusUpdate = async (memberId, statusValue) => {
    const membershipStatus = parseInt(statusValue, 10)
    if (![1, 2, 3, 4].includes(membershipStatus)) {
      alert('Invalid status value.')
      return
    }
    try {
      setUpdatingMemberId(memberId)
      await membersApi.updateMembershipStatus(memberId, { membershipStatus })
      await loadMembers()
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setUpdatingMemberId(null)
    }
  }

  if (loading) return <div className={styles.loading}>Loading members...</div>
  if (error) return <div className={styles.error}>Error: {error}</div>

  return (
    <div className={styles.container}>
      <h2>Members Management</h2>
      {members.length === 0 ? (
        <p className={styles.empty}>No members yet</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Membership Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => {
                const statusLabel = STATUS_LABELS[member.status] || 'Unknown'
                const isUpdating = updatingMemberId === member.memberId
                return (
                  <tr key={member.memberId}>
                    <td>{member.name || 'Unknown'}</td>
                    <td>{member.email || 'N/A'}</td>
                    <td>{member.planName || 'No Plan'}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[`status${member.status}`] || ''}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionsRow}>
                        <button 
                          className={styles.btnSmall}
                          onClick={() => handleFreeze(member.memberId)}
                          disabled={isUpdating || member.status === 3}
                        >
                          {member.status === 3 ? 'Frozen' : 'Freeze'}
                        </button>
                        <select
                          className={styles.statusSelect}
                          value={member.status}
                          onChange={(e) => handleStatusUpdate(member.memberId, e.target.value)}
                          disabled={isUpdating}
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
