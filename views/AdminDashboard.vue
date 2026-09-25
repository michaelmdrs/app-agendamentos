<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto space-y-6">
      
      <!-- Top Bar -->
      <div class="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Painel de Gestão - Agenda</h1>
          <p class="text-xs text-gray-500">Acompanhe os agendamentos em tempo real</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <router-link to="/admin" :class="['text-xs px-3 py-2 rounded-lg font-bold border transition', $route.path === '/admin' ? 'bg-brand-600 text-white border-brand-600' : 'bg-gray-100 text-gray-700 border-gray-200']">
            Agendamentos
          </router-link>
          <router-link to="/admin/configuracao" :class="['text-xs px-3 py-2 rounded-lg font-bold border transition', $route.path === '/admin/configuracao' ? 'bg-brand-600 text-white border-brand-600' : 'bg-gray-100 text-gray-700 border-gray-200']">
            Configuração
          </router-link>
          <router-link to="/" class="text-xs bg-brand-50 text-brand-600 px-3 py-2 rounded-lg font-bold border border-brand-200">
            Ver Visão do Cliente ↗
          </router-link>
        </div>
      </div>

      <!-- Filtros e Ações -->
      <div class="bg-white p-4 rounded-xl shadow flex gap-4 items-center">
        <label class="text-sm font-bold text-gray-600">Filtrar Data:</label>
        <input type="date" v-model="filterDate" class="p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500" />
      </div>

      <!-- Lista de Agendamentos -->
      <div class="bg-white rounded-xl shadow overflow-hidden">
        <div class="p-4 border-b bg-gray-50 font-bold text-gray-700 flex justify-between">
          <span>Agendamentos do Dia</span>
          <span class="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700">{{ filteredAppointments.length }} agendamento(s)</span>
        </div>

        <div v-if="filteredAppointments.length === 0" class="p-8 text-center text-gray-400 text-sm">
          Nenhum agendamento encontrado para esta data.
        </div>

        <div v-else class="divide-y">
          <div 
            v-for="app in filteredAppointments" 
            :key="app.id"
            class="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition"
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-lg text-brand-700">{{ app.time }}</span>
                <span class="font-semibold text-gray-800">— {{ app.client_name }}</span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">
                Serviço: <strong>{{ getServiceName(app.service_id) }}</strong> | Profissional: <strong>{{ getResourceName(app.resource_id) }}</strong>
              </p>
              <p class="text-xs text-gray-400">WhatsApp: {{ app.client_phone }}</p>
            </div>

            <!-- Alterar Status -->
            <div class="flex items-center gap-2">
              <span :class="['px-2.5 py-1 text-xs font-bold rounded-full', statusBadge(app.status)]">
                {{ app.status }}
              </span>

              <button 
                v-if="app.status !== 'cancelled'" 
                @click="changeStatus(app.id, 'cancelled')" 
                class="text-xs text-red-600 hover:underline font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '../services/mockStorage'

const filterDate = ref(new Date().toISOString().split('T')[0])
const appointments = ref([])
const services = ref([])
const resources = ref([])

const loadData = () => {
  const data = db.get()
  appointments.value = data.appointments
  services.value = data.services
  resources.value = data.resources
}

onMounted(() => {
  loadData()
})

const filteredAppointments = computed(() => {
  return appointments.value.filter(a => a.date === filterDate.value)
})

const getServiceName = (id) => services.value.find(s => s.id === id)?.name || 'N/A'
const getResourceName = (id) => resources.value.find(r => r.id === id)?.name || 'N/A'

const changeStatus = (id, newStatus) => {
  db.updateAppointmentStatus(id, newStatus)
  loadData()
}

const statusBadge = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-700'
    case 'cancelled': return 'bg-red-100 text-red-700'
    case 'completed': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}
</script>