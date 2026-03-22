import { useState } from 'react'
import { authAdminApi } from '../../api'
import styles from './AdminStaff.module.css'

const ROLES = [
  { value: 2, label: 'Trainer' },
  { value: 1, label: 'Admin' },
]

export default function AdminStaff() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 2,
    specialization: '',
    certificationDetails: '',
    bio: '',
    salaryAmount: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'role' || name === 'salaryAmount' ? 
        (name === 'role' ? parseInt(value) : parseFloat(value)) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      await authAdminApi.createStaff(formData)
      setSuccess('Staff member created successfully!')
      setFormData({
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 2,
        specialization: '',
        certificationDetails: '',
        bio: '',
        salaryAmount: '',
      })
      setShowForm(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Staff Management</h2>
        <button 
          className={styles.btnPrimary}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Staff'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {showForm && (
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                {ROLES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <input
                type="number"
                name="salaryAmount"
                placeholder="Salary"
                value={formData.salaryAmount}
                onChange={handleInputChange}
                step="0.01"
              />
            </div>

            <textarea
              name="specialization"
              placeholder="Specialization (if trainer)"
              value={formData.specialization}
              onChange={handleInputChange}
              rows="2"
            />
            <textarea
              name="certificationDetails"
              placeholder="Certification Details"
              value={formData.certificationDetails}
              onChange={handleInputChange}
              rows="2"
            />
            <textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="2"
            />

            <button 
              type="submit" 
              className={styles.btnPrimary} 
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Staff Member'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
