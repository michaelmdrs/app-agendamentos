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
  getServices() {
    return this.get().services || []
  },
  addService(service) {
    const data = this.get()
    const newService = {
      id: 'serv-' + Date.now(),
      name: service.name,
      description: service.description || '',
      duration_minutes: Number(service.duration_minutes) || 30,
      price: Number(service.price) || 0,
      active: service.active ?? true
    }
    if (!data.services) data.services = []
    data.services.push(newService)
    this.save(data)
    return newService
  },
  updateService(id, payload) {
    const data = this.get()
    const service = (data.services || []).find(item => item.id === id)
    if (!service) return null

    Object.assign(service, {
      ...payload,
      duration_minutes: payload.duration_minutes !== undefined ? Number(payload.duration_minutes) : service.duration_minutes,
      price: payload.price !== undefined ? Number(payload.price) : service.price
    })
    this.save(data)
    return service
  },
  deleteService(id) {
    const data = this.get()
    data.services = (data.services || []).filter(item => item.id !== id)
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