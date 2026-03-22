import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  const login = useCallback((userData) => {
    const normalizedUser = {
      ...userData,
      userId: userData?.userId ?? userData?.UserId ?? userData?.id ?? null,
      memberId: userData?.memberId ?? userData?.MemberId ?? null,
      trainerId: userData?.trainerId ?? userData?.TrainerId ?? null,
      role: userData?.role ?? userData?.Role ?? '',
    }
    localStorage.setItem('token', normalizedUser.token)
    localStorage.setItem('user', JSON.stringify(normalizedUser))
    setUser(normalizedUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const isAuthenticated = !!user && !!localStorage.getItem('token')

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
