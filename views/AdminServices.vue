<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      
      <!-- Top Bar com Navegação -->
      <div class="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold text-gray-800">Serviços</h1>
            <span v-if="isMock" class="text-[11px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
              Mock Local
            </span>
            <span v-else class="text-[11px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full border border-green-200">
              PostgreSQL Conectado
            </span>
          </div>
          <p class="text-xs text-gray-500">Cadastre os serviços oferecidos, tempo de duração e valores cobrados.</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <router-link to="/admin" class="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold border border-gray-200 hover:bg-gray-200 transition">
            Agendamentos
          </router-link>
          <router-link to="/admin/servicos" class="text-xs bg-brand-600 text-white px-3 py-2 rounded-lg font-bold border border-brand-600 transition">
            Serviços
          </router-link>
          <router-link to="/admin/profissionais" class="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold border border-gray-200 hover:bg-gray-200 transition">
            Profissionais
          </router-link>
          <router-link to="/admin/configuracao" class="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold border border-gray-200 hover:bg-gray-200 transition">
            Configuração
          </router-link>
          <button @click="logout" class="text-xs bg-red-50 text-red-600 px-3 py-2 rounded-lg font-bold border border-red-200 hover:bg-red-100 transition">
            Sair
          </button>
          <router-link to="/" class="text-xs bg-brand-50 text-brand-600 px-3 py-2 rounded-lg font-bold border border-brand-200 hover:bg-brand-100 transition">
            Ver Cliente ↗
          </router-link>
        </div>
      </div>

      <!-- Conteúdo Principal -->
      <div class="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        
        <!-- Formulário de Cadastro/Edição -->
        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>{{ editingId ? '✏️ Editar Serviço' : '➕ Novo Serviço' }}</span>
          </h2>

          <form @submit.prevent="saveService" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nome do Serviço *
              </label>
              <input
                v-model="form.name"
                placeholder="Ex: Corte Degrade, Barba Terapia, Manicure"
                class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Duração (minutos) *
                </label>
                <input
                  v-model.number="form.duration_minutes"
                  type="number"
                  min="5"
                  step="5"
                  placeholder="30"
                  class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  required
                />
                <div class="flex gap-1 mt-1.5">
                  <button
                    type="button"
                    v-for="min in [15, 30, 45, 60]"
                    :key="min"
                    @click="form.duration_minutes = min"
                    class="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded border"
                  >
                    {{ min }}m
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$) *
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-3 text-gray-400 font-medium text-sm">R$</span>
                  <input
                    v-model.number="form.price"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="45.00"
                    class="w-full p-3 pl-10 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500 font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Descrição (Opcional)
              </label>
              <textarea
                v-model="form.description"
                rows="2"
                placeholder="Ex: Lavagem inclusa, finalização com pomada e toalha quente."
                class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              ></textarea>
            </div>

            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pt-1">
              <input type="checkbox" v-model="form.active" class="h-4 w-4 rounded text-brand-600 focus:ring-brand-500" />
              <span>Serviço ativo para agendamento</span>
            </label>

            <div class="flex gap-2 pt-2">
              <button
                type="submit"
                class="flex-1 py-3 rounded-xl bg-brand-600 text-white font-bold shadow hover:bg-brand-700 transition"
              >
                {{ editingId ? 'Salvar Alterações' : 'Cadastrar Serviço' }}
              </button>

              <button
                v-if="editingId"
                type="button"
                @click="cancelEdit"
                class="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de Serviços Cadastrados -->
        <div class="bg-white rounded-xl shadow overflow-hidden flex flex-col">
          <div class="p-4 border-b bg-gray-50 font-bold text-gray-700 flex justify-between items-center">
            <span>Serviços Cadastrados</span>
            <span class="text-xs bg-gray-200 px-2.5 py-1 rounded-md text-gray-700 font-bold">
              {{ services.length }} serviço(s)
            </span>
          </div>

          <div v-if="services.length === 0" class="p-8 text-center text-gray-400 text-sm my-auto">
            Nenhum serviço cadastrado ainda. Use o formulário ao lado para adicionar o primeiro.
          </div>

          <div v-else class="divide-y overflow-y-auto max-h-[600px]">
            <div
              v-for="service in services"
              :key="service.id"
              class="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-gray-50 transition"
            >
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-gray-900">{{ service.name }}</h3>
                  <span
                    :class="[
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      service.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                    ]"
                  >
                    {{ service.active ? 'Ativo' : 'Inativo' }}
                  </span>
                </div>
                <div class="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span class="flex items-center gap-1 font-semibold text-gray-700">
                    ⏱ {{ service.duration_minutes }} min
                  </span>
                  <span>•</span>
                  <span class="font-bold text-brand-700 text-sm">
                    R$ {{ Number(service.price).toFixed(2) }}
                  </span>
                </div>
                <p v-if="service.description" class="text-xs text-gray-400 mt-1 italic">
                  {{ service.description }}
                </p>
              </div>

              <div class="flex items-center gap-2 self-end sm:self-center">
                <button
                  @click="editService(service)"
                  class="text-xs px-2.5 py-1.5 rounded-lg border border-brand-200 text-brand-700 font-semibold hover:bg-brand-50 transition"
                >
                  Editar
                </button>
                <button
                  @click="deleteService(service.id)"
                  class="text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { dataService } from '../services/database'

const services = ref([])
const editingId = ref(null)
const orgId = ref(null)
const isMock = ref(dataService.isUsingMock())

const form = ref({
  name: '',
  description: '',
  duration_minutes: 30,
  price: 40.00,
  active: true
})

const loadServices = async () => {
  const org = await dataService.getOrganization()
  orgId.value = org?.id
  services.value = await dataService.getServices(orgId.value, false)
}

onMounted(() => {
  loadServices()
})

const saveService = async () => {
  if (editingId.value) {
    await dataService.updateService(editingId.value, { ...form.value })
  } else {
    await dataService.addService({ ...form.value }, orgId.value)
  }

  cancelEdit()
  await loadServices()
}

const editService = (service) => {
  editingId.value = service.id
  form.value = {
    name: service.name,
    description: service.description || '',
    duration_minutes: service.duration_minutes,
    price: service.price,
    active: service.active ?? true
  }
}

const cancelEdit = () => {
  editingId.value = null
  form.value = {
    name: '',
    description: '',
    duration_minutes: 30,
    price: 40.00,
    active: true
  }
}

const deleteService = async (id) => {
  if (confirm('Tem certeza que deseja excluir este serviço?')) {
    await dataService.deleteService(id)
    await loadServices()
    if (editingId.value === id) cancelEdit()
  }
}

const logout = () => {
  localStorage.removeItem('agendaflex_admin_session')
  window.location.href = '/admin/login'
}
</script>
