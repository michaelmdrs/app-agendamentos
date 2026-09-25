<template>
  <div class="max-w-md mx-auto min-h-screen bg-white shadow-md flex flex-col pb-10">
    <!-- Header Org -->
    <div class="bg-gray-900 text-white p-6 text-center">
      <h1 class="text-xl font-bold">{{ org.name }}</h1>
      <p class="text-xs text-gray-400 mt-1">{{ org.address }}</p>
    </div>

    <!-- Progresso -->
    <div class="flex border-b text-xs font-semibold text-gray-500">
      <div :class="['flex-1 py-3 text-center border-b-2', step === 1 ? 'border-brand-500 text-brand-600' : '']">1. Serviço</div>
      <div :class="['flex-1 py-3 text-center border-b-2', step === 2 ? 'border-brand-500 text-brand-600' : '']">2. Data & Hora</div>
      <div :class="['flex-1 py-3 text-center border-b-2', step === 3 ? 'border-brand-500 text-brand-600' : '']">3. Seus Dados</div>
    </div>

    <!-- Passo 1: Serviços e Profissional -->
    <div v-if="step === 1" class="p-4 space-y-6">
      <div>
        <h2 class="font-bold text-gray-800 mb-3">1. Escolha o Serviço</h2>
        <div class="space-y-2">
          <div 
            v-for="service in services" 
            :key="service.id"
            @click="selectedService = service"
            :class="['p-4 border rounded-xl cursor-pointer flex justify-between items-center transition', selectedService?.id === service.id ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500' : 'border-gray-200 hover:border-gray-300']"
          >
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
          <button
            v-for="res in resources"
            :key="res.id"
            @click="selectedResource = res"
            :class="['p-3 text-xs font-semibold border rounded-lg transition', selectedResource?.id === res.id ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-700']"
          >
            {{ res.name }}
          </button>
        </div>
      </div>

      <button 
        v-if="selectedService && selectedResource"
        @click="step = 2"
        class="w-full py-3 bg-brand-600 text-white font-bold rounded-xl shadow hover:bg-brand-700 transition"
      >
        Continuar
      </button>
    </div>

    <!-- Passo 2: Data e Hora -->
    <div v-if="step === 2" class="p-4 space-y-6">
      <div>
        <h2 class="font-bold text-gray-800 mb-2">Selecione a Data</h2>
        <input 
          type="date" 
          v-model="selectedDate" 
          :min="today"
          class="w-full p-3 border rounded-xl text-gray-800 font-medium focus:ring-2 focus:ring-brand-500 outline-none"
        />
      </div>

      <div v-if="selectedDate">
        <h2 class="font-bold text-gray-800 mb-2">Horários Disponíveis</h2>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="time in availableTimes"
            :key="time"
            @click="selectedTime = time"
            :class="['py-2.5 text-sm font-semibold border rounded-lg transition', selectedTime === time ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50']"
          >
            {{ time }}
          </button>
        </div>
      </div>

      <div class="flex gap-2">
        <button @click="step = 1" class="w-1/3 py-3 border border-gray-300 font-bold rounded-xl text-gray-600">Voltar</button>
        <button 
          v-if="selectedDate && selectedTime" 
          @click="step = 3" 
          class="w-2/3 py-3 bg-brand-600 text-white font-bold rounded-xl shadow hover:bg-brand-700 transition"
        >
          Avançar
        </button>
      </div>
    </div>

    <!-- Passo 3: Dados do Cliente -->
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

      <!-- Resumo -->
      <div class="bg-gray-50 p-4 rounded-xl space-y-2 border text-sm text-gray-700">
        <p><strong>Serviço:</strong> {{ selectedService.name }} (R$ {{ selectedService.price.toFixed(2) }})</p>
        <p><strong>Profissional:</strong> {{ selectedResource.name }}</p>
        <p><strong>Data & Hora:</strong> {{ selectedDate }} às {{ selectedTime }}</p>
      </div>

      <div class="flex gap-2 pt-2">
        <button @click="step = 2" class="w-1/3 py-3 border border-gray-300 font-bold rounded-xl text-gray-600">Voltar</button>
        <button 
          v-if="clientName && clientPhone" 
          @click="confirmBooking" 
          class="w-2/3 py-3 bg-green-600 text-white font-bold rounded-xl shadow hover:bg-green-700 transition"
        >
          Confirmar Agendamento
        </button>
      </div>
    </div>

    <!-- Tela de Sucesso -->
    <div v-if="step === 4" class="p-6 text-center space-y-4 my-auto">
      <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
      <h2 class="text-2xl font-bold text-gray-900">Agendado com Sucesso!</h2>
      <p class="text-gray-600 text-sm">Obrigado {{ clientName }}, seu horário foi reservado.</p>
      <button @click="resetForm" class="w-full py-3 bg-gray-900 text-white font-bold rounded-xl mt-4">Novo Agendamento</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../services/mockStorage'

const step = ref(1)
const org = ref({})
const services = ref([])
const resources = ref([])

const selectedService = ref(null)
const selectedResource = ref(null)
const selectedDate = ref('')
const selectedTime = ref('')
const clientName = ref('')
const clientPhone = ref('')

const today = new Date().toISOString().split('T')[0]
const availableTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

onMounted(() => {
  const data = db.get()
  org.value = data.organization
  services.value = data.services
  resources.value = data.resources
})

const confirmBooking = () => {
  db.addAppointment({
    service_id: selectedService.value.id,
    resource_id: selectedResource.value.id,
    date: selectedDate.value,
    time: selectedTime.value,
    client_name: clientName.value,
    client_phone: clientPhone.value
  })
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