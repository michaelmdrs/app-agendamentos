<template>
  <div class="max-w-md mx-auto min-h-screen bg-gray-50 shadow-xl flex flex-col pb-10 border-x border-gray-100">
    <div class="relative bg-gray-900 text-white">
      <div class="h-32 w-full overflow-hidden opacity-70">
        <img :src="org.banner_url || 'https://via.placeholder.com/800x300'" alt="Capa" class="w-full h-full object-cover" />
      </div>

      <div class="px-6 pb-6 pt-0 relative flex flex-col items-center -mt-12 text-center">
        <div class="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white mb-2">
          <img :src="org.logo_url || 'https://via.placeholder.com/150'" :alt="org.name" class="w-full h-full object-cover" />
        </div>
        <h1 class="text-xl font-black text-gray-900">{{ org.name }}</h1>
        <p class="text-xs text-gray-500 mt-0.5 flex items-center justify-center gap-1">
          📍 {{ org.address }}
        </p>
      </div>
    </div>

    <div class="flex border-y bg-white text-xs font-bold text-gray-400 sticky top-0 z-10 shadow-sm">
      <div :style="step === 1 ? { borderColor: org.primary_color, color: org.primary_color } : {}" :class="['flex-1 py-3 text-center border-b-2 transition', step === 1 ? '' : 'border-transparent']">
        1. Serviços
      </div>
      <div :style="step === 2 ? { borderColor: org.primary_color, color: org.primary_color } : {}" :class="['flex-1 py-3 text-center border-b-2 transition', step === 2 ? '' : 'border-transparent']">
        2. Data & Hora
      </div>
      <div :style="step === 3 ? { borderColor: org.primary_color, color: org.primary_color } : {}" :class="['flex-1 py-3 text-center border-b-2 transition', step === 3 ? '' : 'border-transparent']">
        3. Confirmação
      </div>
    </div>

    <div v-if="step === 1" class="p-4 space-y-6">
      <div>
        <h2 class="font-bold text-gray-800 mb-3">1. Escolha o Serviço</h2>
        <div class="space-y-2">
          <div v-for="service in services" :key="service.id" @click="selectedService = service" :class="['p-4 border rounded-xl cursor-pointer flex justify-between items-center transition', selectedService?.id === service.id ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500' : 'border-gray-200 hover:border-gray-300']">
            <div>
              <p class="font-semibold text-gray-900">{{ service.name }}</p>
              <p class="text-xs text-gray-500">{{ service.duration_minutes }} min</p>
            </div>
            <span class="font-bold text-gray-900">R$ {{ service.price.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div v-if="selectedService">
        <h2 class="font-bold text-gray-800 mb-3">2. Profissional</h2>
        <div class="grid grid-cols-2 gap-2">
          <button v-for="res in resources" :key="res.id" @click="selectedResource = res" :class="['p-3 text-xs font-semibold border rounded-lg transition', selectedResource?.id === res.id ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-700']">
            {{ res.name }}
          </button>
        </div>
      </div>

      <button v-if="selectedService && selectedResource" @click="step = 2" :style="{ backgroundColor: org.primary_color }" class="w-full py-3.5 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition">
        Avançar para Horários
      </button>
    </div>

    <div v-if="step === 2" class="p-4 space-y-6">
      <div>
        <h2 class="font-bold text-gray-800 mb-2">Selecione a Data</h2>
        <input type="date" v-model="selectedDate" :min="today" class="w-full p-3 border rounded-xl text-gray-800 font-medium focus:ring-2 focus:ring-brand-500 outline-none" />
      </div>

      <div v-if="selectedDate">
        <h2 class="font-bold text-gray-800 mb-2">Horários Disponíveis</h2>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="slot in computedTimeSlots"
            :key="slot.time"
            :disabled="slot.isBooked || slot.isPast"
            @click="!slot.isBooked && !slot.isPast && (selectedTime = slot.time)"
            :class="[
              'py-2.5 text-sm font-semibold border rounded-lg transition relative',
              slot.isBooked || slot.isPast
                ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through'
                : selectedTime === slot.time
                  ? 'bg-brand-600 text-white border-brand-600 shadow'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ slot.time }}
            <span v-if="slot.isBooked" class="block text-[10px] text-red-400 font-normal">Ocupado</span>
          </button>
        </div>
      </div>

      <div class="flex gap-2">
        <button @click="step = 1" class="w-1/3 py-3 border border-gray-300 font-bold rounded-xl text-gray-600">Voltar</button>
        <button v-if="selectedDate && selectedTime" @click="step = 3" :style="{ backgroundColor: org.primary_color }" class="w-2/3 py-3 text-white font-bold rounded-xl shadow hover:opacity-90 transition">
          Avançar
        </button>
      </div>
    </div>

    <div v-if="step === 3" class="p-4 space-y-4">
      <h2 class="font-bold text-gray-800">Seus Dados para Confirmação</h2>

      <div>
        <label class="text-xs font-bold text-gray-600 block mb-1">Nome Completo</label>
        <input v-model="clientName" placeholder="Ex: João Silva" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
      </div>

      <div>
        <label class="text-xs font-bold text-gray-600 block mb-1">WhatsApp / Celular</label>
        <input v-model="clientPhone" placeholder="(00) 00000-0000" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
      </div>

      <div class="bg-gray-50 p-4 rounded-xl space-y-2 border text-sm text-gray-700">
        <p><strong>Serviço:</strong> {{ selectedService?.name }} (R$ {{ selectedService?.price?.toFixed(2) }})</p>
        <p><strong>Profissional:</strong> {{ selectedResource?.name }}</p>
        <p><strong>Data & Hora:</strong> {{ selectedDate }} às {{ selectedTime }}</p>
      </div>

      <div class="flex gap-2 pt-2">
        <button @click="step = 2" class="w-1/3 py-3 border border-gray-300 font-bold rounded-xl text-gray-600">Voltar</button>
        <button v-if="clientName && clientPhone" @click="confirmBooking" :style="{ backgroundColor: org.primary_color }" class="w-2/3 py-3 text-white font-bold rounded-xl shadow hover:opacity-90 transition">
          Confirmar Agendamento
        </button>
      </div>
    </div>

    <div v-if="step === 4" class="p-6 text-center space-y-4 my-auto">
      <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
      <h2 class="text-2xl font-bold text-gray-900">Agendado com Sucesso!</h2>
      <p class="text-gray-600 text-sm">Obrigado {{ clientName }}, seu horário foi reservado com sucesso.</p>

      <a
        v-if="whatsappConfirmationUrl"
        :href="whatsappConfirmationUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="block w-full py-3.5 bg-green-600 text-white font-bold rounded-xl shadow hover:bg-green-700 transition"
      >
        📲 Enviar Confirmação via WhatsApp
      </a>

      <button @click="resetForm" class="w-full py-3 bg-gray-900 text-white font-bold rounded-xl mt-2">
        Novo Agendamento
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { dataService } from '../services/database'

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
const services = ref([])
const resources = ref([])
const bookedTimes = ref([])

const selectedService = ref(null)
const selectedResource = ref(null)
const selectedDate = ref('')
const selectedTime = ref('')
const clientName = ref('')
const clientPhone = ref('')

// Data local no fuso horário do dispositivo (evita bug de UTC da noite)
const getTodayDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
const today = getTodayDate()

const baseTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

// Computa horários checando ocupação e se já passaram hoje
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

// Busca horários já agendados quando a data ou profissional muda
watch([selectedResource, selectedDate], async ([res, date]) => {
  if (res && date) {
    bookedTimes.value = await dataService.getBookedTimes(res.id, date)
  } else {
    bookedTimes.value = []
  }
})

const loadData = async () => {
  org.value = await dataService.getOrganization()
  services.value = await dataService.getServices(org.value?.id)
  resources.value = await dataService.getProfessionals(org.value?.id)
}

onMounted(() => {
  loadData()
})

const whatsappConfirmationUrl = computed(() => {
  if (!org.value?.phone || !selectedService.value || !selectedResource.value) return ''
  const cleanPhone = org.value.phone.replace(/\D/g, '')
  const message = encodeURIComponent(
    `Olá! Confirmo meu agendamento na ${org.value.name}:\n` +
    `✂️ Serviço: ${selectedService.value.name}\n` +
    `👤 Profissional: ${selectedResource.value.name}\n` +
    `📅 Data: ${selectedDate.value} às ${selectedTime.value}\n` +
    `Cliente: ${clientName.value}`
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
  selectedDate.value = ''
  selectedTime.value = ''
  clientName.value = ''
  clientPhone.value = ''
}
</script>