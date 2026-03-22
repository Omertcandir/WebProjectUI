import { useState, useEffect } from 'react'
import { workoutsApi, membersApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import styles from './TrainerPrograms.module.css'

const DIFFICULTIES = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Intermediate' },
  { value: 3, label: 'Advanced' },
]

export default function TrainerPrograms() {
  const { user } = useAuth()
  const [shows, setShows] = useState(false)
  const [members, setMembers] = useState([])
  const [exercises, setExercises] = useState([])
  const [selectedExerciseIds, setSelectedExerciseIds] = useState([])
  const [formData, setFormData] = useState({
    memberId: '',
    programName: '',
    difficultyLevel: 1,
  })
  const [loading, setLoading] = useState(false)
  const [membersLoading, setMembersLoading] = useState(true)
  const [exercisesLoading, setExercisesLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const trainerId = user?.trainerId || user?.TrainerId || null

  // Load members and available exercises for program assignment
  useEffect(() => {
    const fetch = async () => {
      try {
        setMembersLoading(true)
        setExercisesLoading(true)
        const [membersData, exercisesData] = await Promise.all([
          membersApi.getAllMembers(),
          workoutsApi.getExercises(),
        ])
        // Response: Array<{ memberId, userId, name, email, status, planName }>
        const membersList = Array.isArray(membersData) ? membersData : []
        const exercisesList = Array.isArray(exercisesData) ? exercisesData : exercisesData?.exercises || []
        setMembers(membersList)
        setExercises(exercisesList)
      } catch (err) {
        console.error('Error loading members:', err)
        setError(err.message)
      } finally {
        setMembersLoading(false)
        setExercisesLoading(false)
      }
    }
    fetch()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'memberId' || name === 'difficultyLevel' ? parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!trainerId) {
      setError('Trainer profile not found in token. Please log in again.')
      return
    }
    if (!formData.memberId) {
      setError('Please select a member')
      return
    }
    if (selectedExerciseIds.length === 0) {
      setError('Please select at least one exercise')
      return
    }
    try {
      setLoading(true)
      setError(null)
      await workoutsApi.createProgram({
        ...formData,
        trainerId,
        exerciseIds: selectedExerciseIds,
      })
      setSuccess('Program created successfully!')
      setFormData({
        memberId: '',
        programName: '',
        difficultyLevel: 1,
      })
      setSelectedExerciseIds([])
      setShows(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExerciseToggle = (exerciseId) => {
    setSelectedExerciseIds((prev) => {
      if (prev.includes(exerciseId)) {
        return prev.filter((id) => id !== exerciseId)
      }
      return [...prev, exerciseId]
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Create Workout Programs</h2>
        <button 
          className={styles.btnPrimary}
          onClick={() => setShows(!shows)}
        >
          {shows ? 'Cancel' : '+ New Program'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {shows && (
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <label className={styles.formLabel}>
              Select Member
              <select
                name="memberId"
                value={formData.memberId}
                onChange={handleInputChange}
                disabled={membersLoading}
                required
              >
                <option value="">
                  {membersLoading ? 'Loading members...' : 'Choose a member...'}
                </option>
                {members.map(member => (
                  <option key={member.memberId} value={member.memberId}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.formLabel}>
              Program Name
              <input
                type="text"
                name="programName"
                placeholder="e.g., Full Body Strength"
                value={formData.programName}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className={styles.formLabel}>
              Difficulty Level
              <select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleInputChange}
              >
                {DIFFICULTIES.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </label>

            <div className={styles.formLabel}>
              Select Exercises
              {exercisesLoading ? (
                <p className={styles.helperText}>Loading exercises...</p>
              ) : exercises.length === 0 ? (
                <p className={styles.helperText}>No exercises found. Add exercises first from Exercise Library.</p>
              ) : (
                <div className={styles.exercisePicker}>
                  {exercises.map((exercise) => (
                    <label key={exercise.id} className={styles.exerciseOption}>
                      <input
                        type="checkbox"
                        checked={selectedExerciseIds.includes(exercise.id)}
                        onChange={() => handleExerciseToggle(exercise.id)}
                      />
                      <span>{exercise.name || `Exercise #${exercise.id}`}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className={styles.btnPrimary} 
              disabled={loading || membersLoading || exercisesLoading}
            >
              {loading ? 'Creating...' : 'Create Program'}
            </button>
          </form>
        </div>
      )}

      <div className={styles.info}>
        <h3>📋 How to Create Programs</h3>
        <p>1. Select a member from the dropdown</p>
        <p>2. Give your program a descriptive name</p>
        <p>3. Select the difficulty level</p>
        <p>4. Click Create and the member will receive their new program</p>
      </div>
    </div>
  )
}
