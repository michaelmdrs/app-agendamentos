const ADMIN_SESSION_KEY = 'agendaflex_admin_session'

export const auth = {
  getSession() {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY))
    } catch {
      return null
    }
  },
  isLoggedIn() {
    const session = this.getSession()
    return Boolean(session && session.loggedIn)
  },
  login({ email, password }) {
    const data = JSON.parse(localStorage.getItem('app_agendamento_db') || '{}')
    const admin = data.admin || {
      email: 'admin@agendaflex.com',
      password: 'admin123'
    }

    if (email === admin.email && password === admin.password) {
      const session = { email, loggedIn: true, role: 'admin' }
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
      return true
    }

    return false
  },
  logout() {
    localStorage.removeItem(ADMIN_SESSION_KEY)
  }
}
