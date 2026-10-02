import { supabase, isSupabaseConfigured } from '../src/supabase'
import { db as mockDb } from './mockStorage'

/**
 * Camada unificada de dados.
 * Se o Supabase estiver configurado no .env, utiliza o PostgreSQL real.
 * Caso contrário, utiliza o mockStorage (LocalStorage) para testes locais offline.
 */
export const dataService = {
  isUsingMock() {
    return !isSupabaseConfigured
  },

  // Organização / Empresa
  async getOrganization(slug = 'barbeariagriffs') {
    if (!isSupabaseConfigured) {
      return mockDb.get().organization
    }

    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (error) throw error
      return data || mockDb.get().organization
    } catch (err) {
      console.warn('Erro ao buscar organização no Supabase, usando mock:', err)
      return mockDb.get().organization
    }
  },

  async updateOrganization(payload) {
    if (!isSupabaseConfigured) {
      return mockDb.updateOrganization(payload)
    }

    try {
      const { data, error } = await supabase
        .from('organizations')
        .update({
          name: payload.name,
          phone: payload.phone,
          address: payload.address,
          logo_url: payload.logo_url,
          banner_url: payload.banner_url,
          primary_color: payload.primary_color
        })
        .eq('id', payload.id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.warn('Erro ao atualizar no Supabase, salvando no mock:', err)
      return mockDb.updateOrganization(payload)
    }
  },

  // Serviços
  async getServices(orgId) {
    if (!isSupabaseConfigured) {
      return mockDb.get().services || []
    }

    try {
      let query = supabase.from('services').select('*').eq('active', true)
      if (orgId) query = query.eq('organization_id', orgId)

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (err) {
      console.warn('Erro ao buscar serviços no Supabase:', err)
      return mockDb.get().services || []
    }
  },

  // Profissionais
  async getProfessionals(orgId) {
    if (!isSupabaseConfigured) {
      return mockDb.getProfessionals()
    }

    try {
      let query = supabase.from('professionals').select('*')
      if (orgId) query = query.eq('organization_id', orgId)

      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (err) {
      console.warn('Erro ao buscar profissionais no Supabase:', err)
      return mockDb.getProfessionals()
    }
  },

  async addProfessional(professional, orgId) {
    if (!isSupabaseConfigured) {
      return mockDb.addProfessional(professional)
    }

    try {
      const { data, error } = await supabase
        .from('professionals')
        .insert([{
          organization_id: orgId || 'a0000000-0000-0000-0000-000000000001',
          name: professional.name,
          specialty: professional.specialty,
          phone: professional.phone,
          active: professional.active ?? true
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.warn('Erro ao inserir profissional no Supabase:', err)
      return mockDb.addProfessional(professional)
    }
  },

  async updateProfessional(id, payload) {
    if (!isSupabaseConfigured) {
      return mockDb.updateProfessional(id, payload)
    }

    try {
      const { data, error } = await supabase
        .from('professionals')
        .update({
          name: payload.name,
          specialty: payload.specialty,
          phone: payload.phone,
          active: payload.active
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      console.warn('Erro ao atualizar profissional no Supabase:', err)
      return mockDb.updateProfessional(id, payload)
    }
  },

  async deleteProfessional(id) {
    if (!isSupabaseConfigured) {
      return mockDb.deleteProfessional(id)
    }

    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.warn('Erro ao deletar profissional no Supabase:', err)
      mockDb.deleteProfessional(id)
    }
  },

  // Agendamentos
  async getAppointments(orgId, date) {
    if (!isSupabaseConfigured) {
      const list = mockDb.getAppointments()
      if (date) return list.filter(a => a.date === date)
      return list
    }

    try {
      let query = supabase.from('appointments').select('*')
      if (orgId) query = query.eq('organization_id', orgId)
      if (date) query = query.eq('booking_date', date)

      const { data, error } = await query.order('start_time', { ascending: true })
      if (error) throw error

      // Mapeia para compatibilidade com o formato esperado pelo frontend
      return (data || []).map(item => ({
        id: item.id,
        service_id: item.service_id,
        resource_id: item.professional_id,
        date: item.booking_date,
        time: item.start_time?.slice(0, 5),
        client_name: item.client_name,
        client_phone: item.client_phone,
        status: item.status
      }))
    } catch (err) {
      console.warn('Erro ao buscar agendamentos no Supabase:', err)
      const list = mockDb.getAppointments()
      if (date) return list.filter(a => a.date === date)
      return list
    }
  },

  // Horários já reservados (para evitar overbooking)
  async getBookedTimes(professionalId, date) {
    if (!isSupabaseConfigured) {
      const list = mockDb.getAppointments()
      return list
        .filter(a => (a.resource_id === professionalId || a.professional_id === professionalId) && a.date === date && a.status !== 'cancelled')
        .map(a => a.time)
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('start_time')
        .eq('professional_id', professionalId)
        .eq('booking_date', date)
        .neq('status', 'cancelled')

      if (error) throw error
      return (data || []).map(a => a.start_time?.slice(0, 5))
    } catch (err) {
      console.warn('Erro ao consultar horários ocupados no Supabase:', err)
      return []
    }
  },

  async addAppointment(appointment, orgId) {
    if (!isSupabaseConfigured) {
      return mockDb.addAppointment(appointment)
    }

    try {
      const payload = {
        organization_id: orgId || 'a0000000-0000-0000-0000-000000000001',
        professional_id: appointment.resource_id || appointment.professional_id,
        service_id: appointment.service_id,
        client_name: appointment.client_name,
        client_phone: appointment.client_phone,
        booking_date: appointment.date,
        start_time: appointment.time,
        status: 'confirmed'
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert([payload])
        .select()
        .single()

      if (error) throw error
      return {
        id: data.id,
        ...appointment,
        status: data.status
      }
    } catch (err) {
      console.warn('Erro ao criar agendamento no Supabase:', err)
      return mockDb.addAppointment(appointment)
    }
  },

  async updateAppointmentStatus(id, newStatus) {
    if (!isSupabaseConfigured) {
      return mockDb.updateAppointmentStatus(id, newStatus)
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.warn('Erro ao atualizar status no Supabase:', err)
      mockDb.updateAppointmentStatus(id, newStatus)
    }
  }
}
