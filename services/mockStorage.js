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
  getProfessionals() {
    return this.get().professionals || []
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
  addProfessional(professional) {
    const data = this.get()
    const newProfessional = {
      id: 'prof-' + Date.now(),
      active: true,
      ...professional
    }
    data.professionals.push(newProfessional)
    data.resources = data.professionals.map((item) => ({
      id: item.id,
      name: item.name,
      active: item.active
    }))
    this.save(data)
    return newProfessional
  },
  updateProfessional(id, payload) {
    const data = this.get()
    const professional = data.professionals.find(item => item.id === id)
    if (!professional) return null

    Object.assign(professional, payload)
    data.resources = data.professionals.map((item) => ({
      id: item.id,
      name: item.name,
      active: item.active
    }))
    this.save(data)
    return professional
  },
  deleteProfessional(id) {
    const data = this.get()
    data.professionals = data.professionals.filter(item => item.id !== id)
    data.resources = data.professionals.map((item) => ({
      id: item.id,
      name: item.name,
      active: item.active
    }))
    this.save(data)
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