import { initialData } from '../mock/initialData'

const STORAGE_KEY = 'app_agendamento_db'

export const db = {
  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
    }
  },
  get() {
    this.init()
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  },
  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },
  getAppointments() {
    return this.get().appointments || []
  },
  updateOrganization(nextOrganization) {
    const data = this.get()
    data.organization = {
      ...data.organization,
      ...nextOrganization
    }
    this.save(data)
    return data.organization
  },
  addAppointment(appointment) {
    const data = this.get()
    const newApp = {
      id: 'app-' + Date.now(),
      status: 'confirmed',
      ...appointment
    }
    data.appointments.push(newApp)
    this.save(data)
    return newApp
  },
  updateAppointmentStatus(id, newStatus) {
    const data = this.get()
    const app = data.appointments.find(a => a.id === id)
    if (app) {
      app.status = newStatus
      this.save(data)
    }
  }
}