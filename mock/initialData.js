export const initialData = {
  admin: {
    email: 'admin@agendaflex.com',
    password: 'admin123'
  },
  organization: {
    id: 'org-1',
    name: 'Barbearia & Estilo Griffs',
    slug: 'barbeariagriffs',
    phone: '(11) 99999-8888',
    address: 'Rua das Flores, 123 - Centro',
    logo_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
    primary_color: '#0284c7'
  },
  professionals: [
    { id: 'prof-1', name: 'Carlos Barbeiro', specialty: 'Barbeiro', phone: '(11) 98888-1111', active: true },
    { id: 'prof-2', name: 'Lucas Especialista', specialty: 'Cortes e Estilo', phone: '(11) 98888-2222', active: true },
    { id: 'prof-3', name: 'Qualquer Profissional', specialty: 'Atendimento Geral', phone: '(11) 98888-3333', active: true }
  ],
  resources: [
    { id: 'res-1', name: 'Carlos Barbeiro', active: true },
    { id: 'res-2', name: 'Lucas Especialista', active: true },
    { id: 'res-3', name: 'Qualquer Profissional', active: true }
  ],
  services: [
    { id: 'serv-1', name: 'Corte de Cabelo', duration_minutes: 30, price: 40.00, active: true },
    { id: 'serv-2', name: 'Barba Terapia', duration_minutes: 30, price: 35.00, active: true },
    { id: 'serv-3', name: 'Combo Corte + Barba', duration_minutes: 60, price: 65.00, active: true },
    { id: 'serv-4', name: 'Sobrançelha / Detalhe', duration_minutes: 15, price: 20.00, active: true }
  ],
  appointments: [
    {
      id: 'app-1',
      resource_id: 'res-1',
      service_id: 'serv-1',
      client_name: 'João Silva',
      client_phone: '11988887777',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      status: 'confirmed'
    }
  ]
}