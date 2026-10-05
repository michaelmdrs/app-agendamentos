<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto space-y-6">
      
      <!-- Top Bar -->
      <div class="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold text-gray-800">Painel de Gestão - Agenda</h1>
            <span v-if="isMock" class="text-[11px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
              Mock Local
            </span>
            <span v-else class="text-[11px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full border border-green-200">
              PostgreSQL Conectado
            </span>
          </div>
          <p class="text-xs text-gray-500">Acompanhe os agendamentos em tempo real</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <router-link to="/admin" :class="['text-xs px-3 py-2 rounded-lg font-bold border transition', $route.path === '/admin' ? 'bg-brand-600 text-white border-brand-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200']">
            Agendamentos
          </router-link>
          <router-link to="/admin/servicos" :class="['text-xs px-3 py-2 rounded-lg font-bold border transition', $route.path === '/admin/servicos' ? 'bg-brand-600 text-white border-brand-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200']">
            Serviços
          </router-link>
          <router-link to="/admin/profissionais" :class="['text-xs px-3 py-2 rounded-lg font-bold border transition', $route.path === '/admin/profissionais' ? 'bg-brand-600 text-white border-brand-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200']">
            Profissionais
          </router-link>
          <router-link to="/admin/configuracao" :class="['text-xs px-3 py-2 rounded-lg font-bold border transition', $route.path === '/admin/configuracao' ? 'bg-brand-600 text-white border-brand-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200']">
            Configuração
          </router-link>
          <button @click="logout" class="text-xs bg-red-50 text-red-600 px-3 py-2 rounded-lg font-bold border border-red-200">
            Sair
          </button>
          <router-link :to="publicBookingPath" class="text-xs bg-brand-50 text-brand-600 px-3 py-2 rounded-lg font-bold border border-brand-200">
            Ver Visão do Cliente ↗
          </router-link>
        </div>
      </div>

      <!-- Banner de Diagnóstico do Mock vs Supabase -->
      <div v-if="isMock" class="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs space-y-2 text-amber-950 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 font-black text-sm text-amber-900">
            <span>⚠️</span>
            <span>Painel Rodando no Modo Contingência (Mock Local)</span>
          </div>
          <span class="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
            Offline / Mock
          </span>
        </div>
        
        <p class="text-amber-800 leading-relaxed font-medium">
          {{ connectionResult?.reason || 'Identificando configuração de banco de dados...' }}
        </p>

        <div class="bg-white/90 backdrop-blur rounded-xl p-3 border border-amber-200 text-[11px] font-mono space-y-1">
          <div class="flex justify-between items-center">
            <span>• VITE_SUPABASE_URL:</span>
            <span :class="diag.hasUrl ? 'text-green-700 font-bold' : 'text-red-600 font-bold'">
              {{ diag.hasUrl ? '✅ ' + diag.urlPreview : '❌ Não detectada no build' }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span>• VITE_SUPABASE_ANON_KEY:</span>
            <span :class="diag.hasKey ? 'text-green-700 font-bold' : 'text-red-600 font-bold'">
              {{ diag.hasKey ? '✅ ' + diag.keyLength + ' caracteres' : '❌ Não detectada no build' }}
            </span>
          </div>
        </div>

        <p class="text-[11px] text-amber-700">
          💡 <strong>Importante na Vercel:</strong> Após salvar as variáveis em <em>Settings &gt; Environment Variables</em>, você precisa ir na aba <strong>Deployments &gt; ... &gt; Redeploy</strong> para que o Vite compile as chaves no site.
        </p>
      </div>

      <!-- Card de Compartilhamento do Link do Negócio -->
      <div class="bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl p-5 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span class="text-[10px] bg-white/20 text-white font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
            Link para Clientes (Bio do Instagram / WhatsApp)
          </span>
          <p class="text-sm font-semibold mt-1.5 text-white">
            Seus clientes agendam sozinhos através deste link:
          </p>
          <p class="text-xs font-mono bg-black/25 px-3 py-1.5 rounded-lg mt-2 inline-block text-brand-100 select-all border border-white/10">
            {{ publicBookingUrl }}
          </p>
        </div>

        <div class="flex gap-2 w-full md:w-auto">
          <button
            @click="copyBookingLink"
            class="flex-1 md:flex-none text-xs bg-white text-brand-700 hover:bg-brand-50 px-4 py-2.5 rounded-lg font-bold shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{{ copied ? '✓ Link Copiado!' : '📋 Copiar Link' }}</span>
          </button>
          
          <a
            :href="publicBookingUrl"
            target="_blank"
            class="flex-1 md:flex-none text-xs bg-brand-500/40 hover:bg-brand-500/60 text-white px-3.5 py-2.5 rounded-lg font-bold border border-white/30 transition flex items-center justify-center gap-1"
          >
            <span>Testar ↗</span>
          </a>
        </div>
      </div>

      <!-- Alerta de Período de Teste de 14 Dias -->
      <div v-if="subscriptionInfo.isTrial && !subscriptionInfo.expired" class="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
        <div class="flex items-center gap-2 text-amber-900 font-medium">
          <span class="text-base">⏳</span>
          <span>Período Piloto Gratuito: <strong>{{ subscriptionInfo.daysRemaining }} dias restantes</strong> de teste sem compromisso.</span>
        </div>
        <span class="text-amber-800 font-bold bg-amber-200/60 px-2.5 py-1 rounded-md text-[11px]">
          14 Dias Grátis
        </span>
      </div>

      <div v-else-if="subscriptionInfo.expired" class="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs shadow-sm">
        <div class="flex items-center gap-3 text-red-900">
          <span class="text-2xl">⚠️</span>
          <div>
            <p class="font-extrabold text-sm text-red-950">Seu período de teste de 14 dias terminou!</p>
            <p class="text-red-700 mt-0.5">Sua agenda online pública foi pausada para novos clientes. Renove sua assinatura para manter sua agenda rodando.</p>
          </div>
        </div>
        <a
          href="https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20ativar%20minha%20assinatura%20do%20Marcô"
          target="_blank"
          class="bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2.5 rounded-xl shadow transition whitespace-nowrap text-xs"
        >
          Ativar por R$ 59,90/mês
        </a>
      </div>

      <!-- Métricas / KPIs do Dia -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p class="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Agendamentos Hoje</p>
            <p class="text-2xl font-black text-slate-800 mt-0.5">{{ filteredAppointments.length }}</p>
          </div>
          <div class="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg font-bold">
            📅
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p class="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Faturamento Previsto</p>
            <p class="text-2xl font-black text-emerald-600 mt-0.5">R$ {{ totalEstimatedRevenue.toFixed(2) }}</p>
          </div>
          <div class="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg font-bold">
            💰
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p class="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Equipe Ativa</p>
            <p class="text-2xl font-black text-slate-800 mt-0.5">{{ resources.filter(r => r.active !== false).length }}</p>
          </div>
          <div class="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-lg font-bold">
            👥
          </div>
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
import { dataService } from '../services/database'

const getLocalDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const filterDate = ref(getLocalDate())
const appointments = ref([])
const services = ref([])
const resources = ref([])
const currentOrg = ref(null)
const subscriptionInfo = ref({ isTrial: true, expired: false, daysRemaining: 14 })
const isMock = ref(dataService.isUsingMock())
const diag = ref(dataService.getDiagnostics())
const connectionResult = ref(null)
const copied = ref(false)

const publicBookingPath = computed(() => {
  return currentOrg.value?.slug ? `/${currentOrg.value.slug}` : '/'
})

const publicBookingUrl = computed(() => {
  const origin = window.location.origin
  return `${origin}${publicBookingPath.value}`
})

const copyBookingLink = async () => {
  try {
    await navigator.clipboard.writeText(publicBookingUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch {
    alert(`Link da agenda: ${publicBookingUrl.value}`)
  }
}

const loadData = async () => {
  const org = await dataService.getOrganization()
  currentOrg.value = org
  subscriptionInfo.value = dataService.checkSubscription(org)
  appointments.value = await dataService.getAppointments(org?.id)
  services.value = await dataService.getServices(org?.id, false)
  resources.value = await dataService.getProfessionals(org?.id)
}

onMounted(async () => {
  await loadData()
  connectionResult.value = await dataService.checkConnection()
  if (connectionResult.value?.connected) {
    isMock.value = false
  } else {
    isMock.value = true
  }
})

const filteredAppointments = computed(() => {
  return appointments.value.filter(a => a.date === filterDate.value)
})

// Calcula o faturamento previsto somando o preço dos serviços dos agendamentos confirmados do dia
const totalEstimatedRevenue = computed(() => {
  return filteredAppointments.value
    .filter(a => a.status !== 'cancelled')
    .reduce((total, app) => {
      const serv = services.value.find(s => s.id === app.service_id)
      return total + (Number(serv?.price) || 0)
    }, 0)
})

const getServiceName = (id) => services.value.find(s => s.id === id)?.name || 'N/A'
const getResourceName = (id) => resources.value.find(r => r.id === id)?.name || 'N/A'

const changeStatus = async (id, newStatus) => {
  await dataService.updateAppointmentStatus(id, newStatus)
  await loadData()
}

const statusBadge = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-700'
    case 'cancelled': return 'bg-red-100 text-red-700'
    case 'completed': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const logout = () => {
  localStorage.removeItem('agendaflex_admin_session')
  window.location.href = '/admin/login'
}
</script>