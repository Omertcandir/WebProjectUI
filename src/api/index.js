const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function buildUrl(path) {
  return API_BASE ? `${API_BASE}${path}` : path
}

function getToken() {
  return localStorage.getItem('token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const validationMessages = data?.errors
      ? Object.values(data.errors).flat().join(' ')
      : ''
    throw new Error(validationMessages || data.detail || data.title || data.message || 'An unexpected error occurred.')
  }
  return data
}

// AUTH
export const authApi = {
  login: (body) =>
    fetch(buildUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse),

  register: (body) =>
    fetch(buildUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse),
}

// WORKOUTS
export const workoutsApi = {
  getExercises: () =>
    fetch(buildUrl('/api/workouts/exercises'), {
      headers: authHeaders(),
    }).then(handleResponse),

  getMemberSessions: (memberId) =>
    fetch(buildUrl(`/api/workouts/members/${memberId}/sessions`), {
      headers: authHeaders(),
    }).then(handleResponse),

  completeSession: (sessionId, body) =>
    fetch(buildUrl(`/api/workouts/sessions/${sessionId}/complete`), {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  createProgram: (body) =>
    fetch(buildUrl('/api/workouts/programs'), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  getProgram: (programId) =>
    fetch(buildUrl(`/api/workouts/programs/${programId}`), {
      headers: authHeaders(),
    }).then(handleResponse),

  createSession: (body) =>
    fetch(buildUrl('/api/workouts/sessions'), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  createExercise: (body) =>
    fetch(buildUrl('/api/workouts/exercises'), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
}

// SUBSCRIPTIONS
export const subscriptionsApi = {
  getPlans: () =>
    fetch(buildUrl('/api/subscriptions/plans'), {
      headers: authHeaders(),
    }).then(handleResponse),

  selectPlan: (body) =>
    fetch(buildUrl('/api/subscriptions/select-plan'), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  assignByTrainer: (body) =>
    fetch(buildUrl('/api/subscriptions/assign-by-trainer'), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  createPlan: (body) =>
    fetch(buildUrl('/api/subscriptions/plans'), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  deactivateExpired: () =>
    fetch(buildUrl('/api/subscriptions/deactivate-expired'), {
      method: 'POST',
      headers: authHeaders(),
    }).then(handleResponse),

  renew: (body) =>
    fetch(buildUrl('/api/subscriptions/renew'), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
}

// PROGRESS
export const progressApi = {
  addMeasurement: (body) =>
    fetch(buildUrl('/api/progress/measurements'), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  getChart: (memberId) =>
    fetch(buildUrl(`/api/progress/members/${memberId}/chart`), {
      headers: authHeaders(),
    }).then(handleResponse),
}

// MEMBERS
export const membersApi = {
  getMember: (memberId) =>
    fetch(buildUrl(`/api/members/${memberId}`), {
      headers: authHeaders(),
    }).then(handleResponse),

  getAllMembers: () =>
    fetch(buildUrl('/api/members'), {
      headers: authHeaders(),
    }).then(handleResponse),

  freezeMember: (memberId) =>
    fetch(buildUrl(`/api/members/${memberId}/freeze`), {
      method: 'PUT',
      headers: authHeaders(),
    }).then(handleResponse),

  updateMembershipStatus: (memberId, body) =>
    fetch(buildUrl(`/api/members/${memberId}/status`), {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
}

// FINANCE
export const financeApi = {
  getTotalRevenue: () =>
    fetch(buildUrl('/api/finance/reports/total-revenue'), {
      headers: authHeaders(),
    }).then(handleResponse),

  getUnpaidSubscriptions: () =>
    fetch(buildUrl('/api/finance/reports/unpaid-subscriptions'), {
      headers: authHeaders(),
    }).then(handleResponse),
}

// AUTH ADMIN
export const authAdminApi = {
  createStaff: (body) =>
    fetch(buildUrl('/api/auth/staff'), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
}

// NOTIFICATIONS
export const notificationsApi = {
  sendExpiredMemberships: () =>
    fetch(buildUrl('/api/notifications/expired-memberships'), {
      method: 'POST',
      headers: authHeaders(),
    }).then(handleResponse),

  sendUpcomingWorkout: (body) =>
    fetch(buildUrl('/api/notifications/upcoming-workout'), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
}
