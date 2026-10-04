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
    const admin = data.admin || { email: 'admin@marco.app', password: 'admin123' }
    const allowedEmails = ['admin@marco.app', 'admin@agendaflex.com', admin.email]

    if (allowedEmails.includes(email) && password === (admin.password || 'admin123')) {
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
