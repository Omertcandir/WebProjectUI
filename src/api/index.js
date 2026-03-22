const API_BASE = 'http://64.226.125.254'

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
    throw new Error(data.detail || data.title || data.message || 'Bir hata oluştu.')
  }
  return data
}

// AUTH
export const authApi = {
  login: (body) =>
    fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse),

  register: (body) =>
    fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse),
}

// WORKOUTS
export const workoutsApi = {
  getMemberSessions: (memberId) =>
    fetch(`${API_BASE}/api/workouts/members/${memberId}/sessions`, {
      headers: authHeaders(),
    }).then(handleResponse),

  completeSession: (sessionId) =>
    fetch(`${API_BASE}/api/workouts/sessions/${sessionId}/complete`, {
      method: 'PUT',
      headers: authHeaders(),
    }).then(handleResponse),

  createProgram: (body) =>
    fetch(`${API_BASE}/api/workouts/programs`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  createSession: (body) =>
    fetch(`${API_BASE}/api/workouts/sessions`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
}

// SUBSCRIPTIONS
export const subscriptionsApi = {
  getPlans: () =>
    fetch(`${API_BASE}/api/subscriptions/plans`, {
      headers: authHeaders(),
    }).then(handleResponse),

  selectPlan: (body) =>
    fetch(`${API_BASE}/api/subscriptions/select-plan`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  assignByTrainer: (body) =>
    fetch(`${API_BASE}/api/subscriptions/assign-by-trainer`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
}

// PROGRESS
export const progressApi = {
  addMeasurement: (body) =>
    fetch(`${API_BASE}/api/progress/measurements`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  getChart: (memberId) =>
    fetch(`${API_BASE}/api/progress/members/${memberId}/chart`, {
      headers: authHeaders(),
    }).then(handleResponse),
}
