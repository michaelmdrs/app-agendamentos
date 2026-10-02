<template>
  <div class="max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl flex flex-col pb-12 border-x border-slate-200/80 font-sans">
    
    <!-- TELA DE TESTE EXPIRADO (BLOQUEIO SUAVE DE MENSALIDADE) -->
    <div v-if="subscriptionInfo.expired" class="p-8 my-auto text-center space-y-5">
      <div class="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
        ⏳
      </div>
      <div>
        <h2 class="text-2xl font-black text-gray-900">{{ org.name }}</h2>
        <p class="text-sm font-semibold text-amber-700 mt-2 bg-amber-50 py-2 px-3 rounded-xl border border-amber-200 inline-block">
          Agenda online temporariamente pausada
        </p>
      </div>
      <p class="text-xs text-gray-500 max-w-xs mx-auto">
        Os agendamentos online deste estabelecimento estão temporariamente em manutenção. Entre em contato diretamente pelo WhatsApp para marcar seu horário.
      </p>
      <a
        v-if="org.phone"
        :href="`https://wa.me/55${org.phone.replace(/\D/g, '')}?text=Olá,%20gostaria%20de%20agendar%20um%20horário!`"
        target="_blank"
        class="inline-flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-2xl shadow-lg transition"
      >
        <span>📲 Chamar no WhatsApp</span>
      </a>
    </div>

    <!-- FLUXO NORMAL DE AGENDAMENTO -->
    <template v-else>
      <!-- Hero Header Moderno com Banner e Logo em Destaque -->
      <div class="relative bg-slate-900 text-white overflow-hidden">
        <!-- Banner com gradiente e overlay escuro de alto contraste -->
        <div class="relative h-40 w-full overflow-hidden bg-slate-800">
          <img
            :src="org.banner_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80'"
            alt="Capa"
            class="w-full h-full object-cover opacity-60 scale-105 transition duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
        </div>

        <!-- Info do Estabelecimento -->
        <div class="px-5 pb-5 pt-0 relative flex flex-col items-center -mt-14 text-center">
          <div class="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white mb-2.5 relative ring-2 ring-black/5">
            <img :src="org.logo_url || 'https://via.placeholder.com/150'" :alt="org.name" class="w-full h-full object-cover" />
          </div>
          
          <div class="flex items-center gap-1.5 justify-center">
            <h1 class="text-xl font-black text-gray-900 tracking-tight">{{ org.name || 'Carregando...' }}</h1>
            <span class="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold" title="Estabelecimento Verificado">✓</span>
          </div>

          <p class="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1 font-medium">
            <span>📍 {{ org.address || 'Endereço não informado' }}</span>
          </p>
        </div>
      </div>

      <!-- Barra de Progresso / Stepper Interativo e Colorido -->
      <div class="bg-white border-y border-slate-200/80 px-4 py-3 sticky top-0 z-20 shadow-sm backdrop-blur-md bg-white/95">
        <div class="flex items-center justify-between text-xs font-bold">
          
          <div
            @click="step > 1 && (step = 1)"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full transition cursor-pointer',
              step === 1
                ? 'bg-slate-900 text-white shadow-sm'
                : step > 1
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-400'
            ]"
          >
            <span>✂️</span>
            <span>1. Serviço</span>
          </div>

          <div class="h-0.5 w-4 bg-slate-200"></div>

          <div
            @click="selectedService && selectedResource && (step = 2)"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full transition',
              step === 2
                ? 'bg-slate-900 text-white shadow-sm'
                : step > 2
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-400'
            ]"
          >
            <span>📅</span>
            <span>2. Horário</span>
          </div>

          <div class="h-0.5 w-4 bg-slate-200"></div>

          <div
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full transition',
              step === 3
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-400'
            ]"
          >
            <span>✅</span>
            <span>3. Confirmar</span>
          </div>
        </div>
      </div>

      <!-- ETAPA 1: ESCOLHA DO SERVIÇO E PROFISSIONAL -->
      <div v-if="step === 1" class="p-5 space-y-6">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
              1. Selecione o Serviço
            </h2>
            <span class="text-xs text-slate-400 font-semibold">{{ services.length }} disponíveis</span>
          </div>

          <div class="space-y-2.5">
            <div
              v-for="service in services"
              :key="service.id"
              @click="selectService(service)"
              :class="[
                'p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex justify-between items-center group',
                selectedService?.id === service.id
                  ? 'border-brand-600 bg-brand-50/60 shadow-md ring-2 ring-brand-500/20'
                  : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-sm'
              ]"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span
                    :class="[
                      'w-4 h-4 rounded-full border flex items-center justify-center transition',
                      selectedService?.id === service.id
                        ? 'border-brand-600 bg-brand-600 text-white text-[10px]'
                        : 'border-slate-300 bg-white'
                    ]"
                  >
                    <span v-if="selectedService?.id === service.id">✓</span>
                  </span>
                  <p class="font-bold text-slate-900 group-hover:text-brand-700 transition">{{ service.name }}</p>
                </div>
                
                <div class="flex items-center gap-2 pl-6">
                  <span class="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                    ⏱ {{ service.duration_minutes }} min
                  </span>
                  <p v-if="service.description" class="text-[11px] text-slate-400 italic line-clamp-1">
                    {{ service.description }}
                  </p>
                </div>
              </div>

              <div class="text-right pl-2">
                <span class="text-base font-extrabold text-slate-900 group-hover:text-brand-700 transition">
                  R$ {{ Number(service.price).toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Escolha do Profissional -->
        <div v-if="selectedService" class="pt-2 animate-fadeIn">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
              2. Escolha o Profissional
            </h2>
            <span class="text-xs text-brand-600 font-bold">Passo 2 de 3</span>
          </div>

          <div v-if="filteredProfessionals.length === 0" class="text-xs text-slate-500 p-4 border rounded-xl bg-white text-center">
            Nenhum profissional disponível para este serviço no momento.
          </div>

          <div v-else class="grid grid-cols-2 gap-2.5">
            <button
              v-for="res in filteredProfessionals"
              :key="res.id"
              type="button"
              @click="selectedResource = res"
              :class="[
                'p-3 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 text-left relative overflow-hidden',
                selectedResource?.id === res.id
                  ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
              ]"
            >
              <div class="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center font-bold text-sm shadow-inner">
                <img v-if="res.avatar_url" :src="res.avatar_url" :alt="res.name" class="w-full h-full object-cover" />
                <span v-else :class="selectedResource?.id === res.id ? 'text-slate-900' : 'text-brand-700'">
                  {{ res.name.charAt(0).toUpperCase() }}
                </span>
              </div>

              <div class="truncate">
                <p class="font-bold text-xs truncate">{{ res.name }}</p>
                <p :class="['text-[10px] truncate mt-0.5', selectedResource?.id === res.id ? 'text-slate-300' : 'text-slate-400 font-medium']">
                  {{ res.specialty || 'Especialista' }}
                </p>
              </div>
            </button>
          </div>
        </div>

        <!-- Botão Avançar -->
        <button
          v-if="selectedService && selectedResource"
          @click="step = 2"
          :style="{ backgroundColor: org.primary_color || '#0284c7' }"
          class="w-full py-4 text-white font-extrabold rounded-2xl shadow-xl hover:opacity-95 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
        >
          <span>Avançar para Horários</span>
          <span>➔</span>
        </button>
      </div>

      <!-- ETAPA 2: DATA E HORÁRIOS -->
      <div v-if="step === 2" class="p-5 space-y-6">
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
              Escolha o Dia
            </h2>
            <div class="flex gap-1.5">
              <button
                type="button"
                @click="selectedDate = today"
                :class="['text-xs px-2.5 py-1 rounded-lg font-bold border transition', selectedDate === today ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200']"
              >
                Hoje
              </button>
              <button
                type="button"
                @click="selectedDate = tomorrow"
                :class="['text-xs px-2.5 py-1 rounded-lg font-bold border transition', selectedDate === tomorrow ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200']"
              >
                Amanhã
              </button>
            </div>
          </div>

          <input
            type="date"
            v-model="selectedDate"
            :min="today"
            class="w-full p-3.5 border-2 border-slate-200 rounded-xl text-slate-800 font-bold focus:border-brand-500 focus:ring-0 outline-none text-sm bg-slate-50/50"
          />
        </div>

        <!-- Grade de Horários -->
        <div v-if="selectedDate" class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
              Horários com {{ selectedResource?.name }}
            </h2>
            <span class="text-xs text-slate-400 font-medium">Toque para selecionar</span>
          </div>

          <div class="grid grid-cols-3 gap-2.5">
            <button
              v-for="slot in computedTimeSlots"
              :key="slot.time"
              :disabled="slot.isBooked || slot.isPast"
              @click="!slot.isBooked && !slot.isPast && (selectedTime = slot.time)"
              :class="[
                'py-3 text-sm font-extrabold border-2 rounded-xl transition-all relative flex flex-col items-center justify-center',
                slot.isBooked || slot.isPast
                  ? 'bg-slate-100/80 text-slate-300 border-slate-200/60 cursor-not-allowed line-through'
                  : selectedTime === slot.time
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
              ]"
            >
              <span>{{ slot.time }}</span>
              <span v-if="slot.isBooked" class="text-[9px] text-red-400 font-semibold no-underline -mt-0.5">Ocupado</span>
            </button>
          </div>
        </div>

        <div class="flex gap-2.5 pt-2">
          <button @click="step = 1" class="w-1/3 py-3.5 border-2 border-slate-300 font-bold rounded-2xl text-slate-600 hover:bg-slate-100 transition text-sm">
            Voltar
          </button>
          <button
            v-if="selectedDate && selectedTime"
            @click="step = 3"
            :style="{ backgroundColor: org.primary_color || '#0284c7' }"
            class="w-2/3 py-3.5 text-white font-extrabold rounded-2xl shadow-xl hover:opacity-95 transition text-sm uppercase tracking-wider"
          >
            Avançar
          </button>
        </div>
      </div>

      <!-- ETAPA 3: DADOS PESSOAIS E CONFIRMAÇÃO (ESTILO VOUCHER / TICKET) -->
      <div v-if="step === 3" class="p-5 space-y-5">
        
        <!-- Ticket de Resumo do Atendimento -->
        <div class="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
          <div class="bg-slate-900 text-white p-4">
            <span class="text-[10px] uppercase font-bold tracking-widest text-brand-300">Resumo da Reserva</span>
            <h3 class="text-base font-extrabold mt-0.5">{{ selectedService?.name }}</h3>
          </div>

          <div class="p-4 space-y-2.5 text-xs text-slate-600 bg-slate-50/50">
            <div class="flex justify-between">
              <span class="text-slate-400">Profissional:</span>
              <span class="font-bold text-slate-800">{{ selectedResource?.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Data & Horário:</span>
              <span class="font-bold text-slate-800">{{ formatDate(selectedDate) }} às {{ selectedTime }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Duração estimada:</span>
              <span class="font-bold text-slate-800">{{ selectedService?.duration_minutes }} minutos</span>
            </div>
            <div class="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
              <span class="font-bold text-slate-700">Valor a pagar no local:</span>
              <span class="font-extrabold text-base text-brand-700">R$ {{ Number(selectedService?.price).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Formulário de Identificação do Cliente -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 class="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
            Seus Dados para Contato
          </h2>

          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">Nome Completo *</label>
            <input
              v-model="clientName"
              placeholder="Ex: João da Silva"
              class="w-full p-3.5 border-2 border-slate-200 rounded-xl outline-none focus:border-brand-500 font-medium text-sm"
              required
            />
          </div>

          <div>
            <label class="text-xs font-bold text-slate-600 block mb-1">WhatsApp / Celular com DDD *</label>
            <input
              v-model="clientPhone"
              placeholder="(11) 98888-7777"
              class="w-full p-3.5 border-2 border-slate-200 rounded-xl outline-none focus:border-brand-500 font-medium text-sm"
              required
            />
          </div>
        </div>

        <div class="flex gap-2.5 pt-2">
          <button @click="step = 2" class="w-1/3 py-3.5 border-2 border-slate-300 font-bold rounded-2xl text-slate-600 hover:bg-slate-100 transition text-sm">
            Voltar
          </button>
          <button
            v-if="clientName.trim() && clientPhone.trim()"
            @click="confirmBooking"
            :style="{ backgroundColor: org.primary_color || '#0284c7' }"
            class="w-2/3 py-4 text-white font-extrabold rounded-2xl shadow-xl hover:opacity-95 transition text-sm uppercase tracking-wider transform active:scale-[0.99]"
          >
            Confirmar Agendamento
          </button>
        </div>
      </div>

      <!-- ETAPA 4: SUCESSO & BOTÃO DO WHATSAPP VIBRANTE -->
      <div v-if="step === 4" class="p-6 text-center space-y-6 my-auto animate-fadeIn">
        <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto text-4xl font-extrabold shadow-lg shadow-emerald-500/20">
          ✓
        </div>
        
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Agendamento Confirmado!</h2>
          <p class="text-slate-500 text-sm mt-1.5">
            Obrigado <strong class="text-slate-800">{{ clientName }}</strong>, seu horário foi reservado com sucesso no sistema da <strong>{{ org.name }}</strong>.
          </p>
        </div>

        <!-- Cartão de Detalhes -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 shadow-sm">
          <p><strong>Serviço:</strong> {{ selectedService?.name }}</p>
          <p><strong>Profissional:</strong> {{ selectedResource?.name }}</p>
          <p><strong>Horário:</strong> {{ formatDate(selectedDate) }} às {{ selectedTime }}</p>
        </div>

        <!-- Botão Oficial do WhatsApp com Efeito de Destaque -->
        <div class="space-y-2 pt-2">
          <a
            v-if="whatsappConfirmationUrl"
            :href="whatsappConfirmationUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black rounded-2xl shadow-xl shadow-green-600/30 transition-all flex items-center justify-center gap-2.5 text-base tracking-wide transform hover:-translate-y-0.5"
          >
            <span>📲</span>
            <span>Enviar Confirmação no WhatsApp</span>
          </a>
          <p class="text-[11px] text-slate-400">Clique para avisar a barbearia pelo WhatsApp em 1 clique</p>
        </div>

        <button
          @click="resetForm"
          class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-xs"
        >
          Fazer Outro Agendamento
        </button>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { dataService } from '../services/database'

const route = useRoute()
const currentSlug = computed(() => route.params.slug || 'barbeariagriffs')

const step = ref(1)
const org = ref({
  id: '',
  name: '',
  address: '',
  phone: '',
  logo_url: '',
  banner_url: '',
  primary_color: '#0284c7'
})
const subscriptionInfo = ref({ active: true, expired: false })
const services = ref([])
const resources = ref([])
const bookedTimes = ref([])

const selectedService = ref(null)
const selectedResource = ref(null)
const selectedDate = ref('')
const selectedTime = ref('')
const clientName = ref('')
const clientPhone = ref('')

// Data local no fuso horário do Brasil (evita o bug de UTC das 21h)
const getLocalDateString = (daysOffset = 0) => {
  const date = new Date()
  if (daysOffset > 0) date.setDate(date.getDate() + daysOffset)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const today = getLocalDateString(0)
const tomorrow = getLocalDateString(1)

const baseTimes = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']

// Computa horários livres
const computedTimeSlots = computed(() => {
  const now = new Date()
  const currentHours = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
  const isToday = selectedDate.value === today

  return baseTimes.map(time => {
    const isBooked = bookedTimes.value.includes(time)
    const isPast = isToday && time <= currentHours
    return { time, isBooked, isPast }
  })
})

// Filtra profissionais disponíveis para o serviço selecionado
const filteredProfessionals = computed(() => {
  if (!selectedService.value) return resources.value.filter(p => p.active !== false)
  return resources.value.filter(prof => {
    if (prof.active === false) return false
    if (!prof.service_ids || prof.service_ids.length === 0) return true
    return prof.service_ids.includes(selectedService.value.id)
  })
})

const selectService = (service) => {
  selectedService.value = service
  // Se o profissional selecionado antes não faz esse serviço, reseta
  if (selectedResource.value && !filteredProfessionals.value.some(p => p.id === selectedResource.value.id)) {
    selectedResource.value = null
  }
}

// Busca horários já ocupados
watch([selectedResource, selectedDate], async ([res, date]) => {
  if (res && date) {
    bookedTimes.value = await dataService.getBookedTimes(res.id, date)
  } else {
    bookedTimes.value = []
  }
})

const loadData = async () => {
  const organizationData = await dataService.getOrganization(currentSlug.value)
  if (organizationData) {
    org.value = organizationData
    subscriptionInfo.value = dataService.checkSubscription(org.value)

    if (org.value.id && !subscriptionInfo.value.expired) {
      services.value = await dataService.getServices(org.value.id, true)
      resources.value = await dataService.getProfessionals(org.value.id)
      
      // Pré-seleciona primeiro profissional se só tiver 1
      if (resources.value.length === 1) {
        selectedResource.value = resources.value[0]
      }
    }
  }
}

onMounted(() => {
  selectedDate.value = today
  loadData()
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

const whatsappConfirmationUrl = computed(() => {
  if (!org.value?.phone || !selectedService.value || !selectedResource.value) return ''
  const cleanPhone = org.value.phone.replace(/\D/g, '')
  const message = encodeURIComponent(
    `Olá! Acabei de fazer um agendamento na *${org.value.name}*:\n\n` +
    `✂️ *Serviço:* ${selectedService.value.name} (R$ ${Number(selectedService.value.price).toFixed(2)})\n` +
    `👤 *Profissional:* ${selectedResource.value.name}\n` +
    `📅 *Data:* ${formatDate(selectedDate.value)} às ${selectedTime.value}\n` +
    `🙋‍♂️ *Cliente:* ${clientName.value}\n` +
    `📱 *Telefone:* ${clientPhone.value}\n\n` +
    `Poderia confirmar por gentileza?`
  )
  return `https://wa.me/55${cleanPhone}?text=${message}`
})

const confirmBooking = async () => {
  await dataService.addAppointment({
    service_id: selectedService.value.id,
    resource_id: selectedResource.value.id,
    date: selectedDate.value,
    time: selectedTime.value,
    client_name: clientName.value,
    client_phone: clientPhone.value
  }, org.value?.id)
  step.value = 4
}

const resetForm = () => {
  step.value = 1
  selectedService.value = null
  selectedResource.value = null
  selectedDate.value = today
  selectedTime.value = ''
  clientName.value = ''
  clientPhone.value = ''
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>