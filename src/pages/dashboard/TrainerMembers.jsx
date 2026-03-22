import { useState, useEffect } from 'react'
import { membersApi, subscriptionsApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import styles from './TrainerMembers.module.css'

const STATUS_LABELS = { 1: 'Active', 2: 'Expired', 3: 'Frozen', 4: 'Cancelled' }
const STATUS_OPTIONS = [
  { value: 1, label: 'Active' },
  { value: 2, label: 'Expired' },
  { value: 3, label: 'Frozen' },
  { value: 4, label: 'Cancelled' },
]

export default function TrainerMembers() {
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAssignForm, setShowAssignForm] = useState(null)
  const [plans, setPlans] = useState([])
  const [formData, setFormData] = useState({ membershipPlanId: '' })
  const [updatingMemberId, setUpdatingMemberId] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [m, p] = await Promise.allSettled([
        membersApi.getAllMembers(),
        subscriptionsApi.getPlans(),
      ])
      if (m.status === 'fulfilled') setMembers(Array.isArray(m.value) ? m.value : [])
      if (p.status === 'fulfilled') setPlans(Array.isArray(p.value) ? p.value : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAssignPlan = async (member) => {
    if (member.status === 3 || member.status === 4) {
      alert('Frozen or cancelled memberships cannot receive a plan. Change status first.')
      return
    }
    if (!formData.membershipPlanId) {
      alert('Please select a plan')
      return
    }
    try {
      await subscriptionsApi.assignByTrainer({
        memberId: member.memberId,
        membershipPlanId: parseInt(formData.membershipPlanId),
        isPaid: false,
      })
      alert('Plan assigned successfully!')
      setShowAssignForm(null)
      setFormData({ membershipPlanId: '' })
      await loadData()
    } catch (err) {
      alert('Error: ' + err.message)
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
      await loadData()
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
      <h2>Manage Members</h2>
      {members.length === 0 ? (
        <p className={styles.empty}>No members yet</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Current Plan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => {
                const statusLabel = STATUS_LABELS[member.status] || 'Unknown'
                const isBlockedForPlan = member.status === 3 || member.status === 4
                const isUpdating = updatingMemberId === member.memberId
                return (
                  <tr key={member.memberId}>
                    <td>{member.name || 'Unknown'}</td>
                    <td>{member.email || 'N/A'}</td>
                    <td>{member.planName || 'None'}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[`status${member.status}`] || ''}`}>{statusLabel}</span>
                    </td>
                    <td>
                      <div className={styles.actionsCol}>
                        {showAssignForm === member.memberId ? (
                          <div className={styles.assignForm}>
                            <select
                              value={formData.membershipPlanId}
                              onChange={(e) => setFormData({ membershipPlanId: e.target.value })}
                            >
                              <option value="">Select Plan...</option>
                              {plans.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                              ))}
                            </select>
                            <button 
                              onClick={() => handleAssignPlan(member)}
                              className={styles.btnSmall}
                              disabled={isBlockedForPlan}
                            >
                              Assign
                            </button>
                            <button
                              onClick={() => setShowAssignForm(null)}
                              className={styles.btnCancel}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowAssignForm(member.memberId)}
                            className={styles.btnAction}
                            disabled={isBlockedForPlan}
                            title={isBlockedForPlan ? 'Set status to Active/Expired first' : ''}
                          >
                            Assign Plan
                          </button>
                        )}

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
