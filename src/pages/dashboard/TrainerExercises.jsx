import { useEffect, useMemo, useState } from 'react'
import { workoutsApi } from '../../api'
import styles from './TrainerExercises.module.css'

const MUSCLE_GROUPS = [
  { value: 1, label: 'Chest' },
  { value: 2, label: 'Back' },
  { value: 3, label: 'Legs' },
  { value: 4, label: 'Shoulders' },
  { value: 5, label: 'Arms' },
  { value: 6, label: 'Core' },
  { value: 7, label: 'Full Body' },
  { value: 8, label: 'Cardio' },
]

export default function TrainerExercises() {
  const [showForm, setShowForm] = useState(false)
  const [exercises, setExercises] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    muscleGroup: 1,
    description: '',
    videoUrl: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const statusMuscleLabel = useMemo(() => {
    const map = {}
    MUSCLE_GROUPS.forEach((item) => {
      map[item.value] = item.label
    })
    return map
  }, [])

  const loadExercises = async () => {
    try {
      setListLoading(true)
      const data = await workoutsApi.getExercises()
      const list = Array.isArray(data) ? data : data?.exercises || []
      setExercises(list)
    } catch (err) {
      // If backend does not expose GET yet, keep UI usable and show a clear message.
      setError(err.message)
      setExercises([])
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    loadExercises()
  }, [])

  const filteredExercises = useMemo(() => {
    if (selectedGroup === 'all') return exercises
    return exercises.filter((exercise) => String(exercise.muscleGroup) === selectedGroup)
  }, [exercises, selectedGroup])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'muscleGroup' ? parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      await workoutsApi.createExercise(formData)
      setSuccess('Exercise added successfully!')
      setFormData({
        name: '',
        muscleGroup: 1,
        description: '',
        videoUrl: '',
      })
      setShowForm(false)
      await loadExercises()
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
        <h2>Exercise Library</h2>
        <button 
          className={styles.btnPrimary}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Exercise'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {showForm && (
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Exercise Name (e.g., Bench Press)"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <select
              name="muscleGroup"
              value={formData.muscleGroup}
              onChange={handleInputChange}
            >
              {MUSCLE_GROUPS.map(mg => (
                <option key={mg.value} value={mg.value}>{mg.label}</option>
              ))}
            </select>
            <textarea
              name="description"
              placeholder="Description and instructions"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              required
              minLength={5}
              maxLength={2000}
            />
            <input
              type="url"
              name="videoUrl"
              placeholder="Video URL (YouTube, etc.)"
              value={formData.videoUrl}
              onChange={handleInputChange}
            />
            <button 
              type="submit" 
              className={styles.btnPrimary} 
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Exercise'}
            </button>
          </form>
        </div>
      )}

      <div className={styles.libraryHeader}>
        <h3>Current Exercises</h3>
        <div className={styles.libraryActions}>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All muscle groups</option>
            {MUSCLE_GROUPS.map((mg) => (
              <option key={mg.value} value={String(mg.value)}>{mg.label}</option>
            ))}
          </select>
          <button type="button" className={styles.btnSecondary} onClick={loadExercises}>
            Refresh
          </button>
        </div>
      </div>

      {listLoading ? (
        <p className={styles.info}>Loading exercises...</p>
      ) : filteredExercises.length === 0 ? (
        <p className={styles.info}>No exercises found for this filter.</p>
      ) : (
        <div className={styles.exerciseList}>
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className={styles.exerciseCard}>
              <div className={styles.exerciseTop}>
                <strong>{exercise.name || 'Unnamed exercise'}</strong>
                <span>{statusMuscleLabel[exercise.muscleGroup] || 'Unknown group'}</span>
              </div>
              <p>{exercise.description || 'No description.'}</p>
              {exercise.videoUrl ? (
                <a href={exercise.videoUrl} target="_blank" rel="noreferrer">Watch video</a>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <div className={styles.info}>
        <p>📚 Build your exercise library to use in workout programs</p>
      </div>
    </div>
  )
}
