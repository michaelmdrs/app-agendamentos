<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      
      <!-- Top Bar com Navegação -->
      <div class="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold text-gray-800">Profissionais</h1>
            <span v-if="isMock" class="text-[11px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
              Mock Local
            </span>
            <span v-else class="text-[11px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full border border-green-200">
              PostgreSQL Conectado
            </span>
          </div>
          <p class="text-xs text-gray-500">Cadastre a equipe, foto de perfil e associe aos serviços que realizam.</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <router-link to="/admin" class="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold border border-gray-200 hover:bg-gray-200 transition">
            Agendamentos
          </router-link>
          <router-link to="/admin/servicos" class="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold border border-gray-200 hover:bg-gray-200 transition">
            Serviços
          </router-link>
          <router-link to="/admin/profissionais" class="text-xs bg-brand-600 text-white px-3 py-2 rounded-lg font-bold border border-brand-600 transition">
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
          <h2 class="text-lg font-bold text-gray-800 mb-4">
            {{ editingId ? '✏️ Editar Profissional' : '➕ Novo Profissional' }}
          </h2>

          <form @submit.prevent="saveProfessional" class="space-y-4">
            
            <!-- Upload de Foto Local do Profissional -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Foto de Perfil</label>
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shadow-inner shrink-0">
                  <img v-if="form.avatar_url" :src="form.avatar_url" alt="Avatar" class="w-full h-full object-cover" />
                  <span v-else class="text-2xl text-gray-400">👤</span>
                </div>
                
                <div class="space-y-1">
                  <label class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg border border-gray-300 transition">
                    <span>📷 Escolher Imagem Local</span>
                    <input type="file" accept="image/*" @change="handleAvatarUpload" class="hidden" />
                  </label>
                  <p class="text-[11px] text-gray-400">PNG, JPG ou WEBP (comprimida automaticamente)</p>
                  <button
                    v-if="form.avatar_url"
                    type="button"
                    @click="form.avatar_url = ''"
                    class="text-[11px] text-red-500 hover:underline block"
                  >
                    Remover foto
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
              <input v-model="form.name" placeholder="Ex: Carlos Barbeiro" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Especialidade / Cargo *</label>
              <input v-model="form.specialty" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" placeholder="Ex: Barbeiro Clássico, Colorista, Designer" required />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Telefone</label>
              <input v-model="form.phone" placeholder="(11) 98888-1111" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            <!-- Seleção de Serviços que este profissional atende -->
            <div v-if="availableServices.length > 0" class="pt-2 border-t">
              <label class="block text-sm font-bold text-gray-700 mb-2">Serviços que este profissional atende:</label>
              <div class="space-y-2 max-h-44 overflow-y-auto pr-1">
                <label
                  v-for="serv in availableServices"
                  :key="serv.id"
                  class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    :value="serv.id"
                    v-model="form.service_ids"
                    class="h-4 w-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <div class="flex-1 flex justify-between">
                    <span class="font-semibold text-gray-800">{{ serv.name }}</span>
                    <span class="text-gray-500 font-medium">R$ {{ Number(serv.price).toFixed(2) }} ({{ serv.duration_minutes }}m)</span>
                  </div>
                </label>
              </div>
              <p class="text-[11px] text-gray-400 mt-1">Se nenhum for selecionado, atenderá todos os serviços cadastrados.</p>
            </div>

            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pt-1">
              <input type="checkbox" v-model="form.active" class="h-4 w-4 rounded text-brand-600 focus:ring-brand-500" />
              <span>Profissional ativo para agendamento</span>
            </label>

            <div class="flex gap-2 pt-2">
              <button type="submit" class="flex-1 py-3 rounded-xl bg-brand-600 text-white font-bold shadow hover:bg-brand-700 transition">
                {{ editingId ? 'Salvar Alterações' : 'Adicionar Profissional' }}
              </button>
              <button v-if="editingId" type="button" @click="cancelEdit" class="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition">
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de Profissionais Cadastrados -->
        <div class="bg-white rounded-xl shadow overflow-hidden flex flex-col">
          <div class="p-4 border-b bg-gray-50 font-bold text-gray-700 flex justify-between items-center">
            <span>Lista de Profissionais</span>
            <span class="text-xs bg-gray-200 px-2.5 py-1 rounded-md text-gray-700 font-bold">{{ professionals.length }}</span>
          </div>

          <div v-if="professionals.length === 0" class="p-8 text-center text-gray-400 text-sm my-auto">
            Nenhum profissional cadastrado ainda.
          </div>

          <div v-else class="divide-y overflow-y-auto max-h-[600px]">
            <div v-for="professional in professionals" :key="professional.id" class="p-4 flex flex-col sm:flex-row justify-between gap-3 sm:items-center hover:bg-gray-50 transition">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-gray-100 border overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                  <img v-if="professional.avatar_url" :src="professional.avatar_url" :alt="professional.name" class="w-full h-full object-cover" />
                  <span v-else class="text-lg font-bold text-brand-700">
                    {{ professional.name.charAt(0).toUpperCase() }}
                  </span>
                </div>

                <div>
                  <div class="flex items-center gap-2">
                    <p class="font-bold text-gray-900">{{ professional.name }}</p>
                    <span :class="['px-2 py-0.5 text-[10px] font-bold rounded-full', professional.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600']">
                      {{ professional.active ? 'Ativo' : 'Inativo' }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500">{{ professional.specialty }}</p>
                  <p class="text-xs text-gray-400">📱 {{ professional.phone || 'Sem telefone' }}</p>
                  
                  <div v-if="professional.service_ids && professional.service_ids.length > 0" class="flex flex-wrap gap-1 mt-1.5">
                    <span
                      v-for="sId in professional.service_ids"
                      :key="sId"
                      class="text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded font-medium border border-brand-200"
                    >
                      {{ getServiceName(sId) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 self-end sm:self-center">
                <button @click="editProfessional(professional)" class="text-xs px-2.5 py-1.5 rounded-lg border border-brand-200 text-brand-700 font-semibold hover:bg-brand-50 transition">
                  Editar
                </button>
                <button @click="deleteProfessional(professional.id)" class="text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition">
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
import { compressImage } from '../src/utils/imageHelper'

const professionals = ref([])
const availableServices = ref([])
const editingId = ref(null)
const orgId = ref(null)
const isMock = ref(dataService.isUsingMock())

const form = ref({
  name: '',
  specialty: '',
  phone: '',
  avatar_url: '',
  service_ids: [],
  active: true
})

const loadData = async () => {
  const org = await dataService.getOrganization()
  orgId.value = org?.id
  professionals.value = await dataService.getProfessionals(orgId.value)
  availableServices.value = await dataService.getServices(orgId.value, false)
}

onMounted(() => {
  loadData()
})

const getServiceName = (serviceId) => {
  return availableServices.value.find(s => s.id === serviceId)?.name || 'Serviço'
}

const handleAvatarUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const compressedBase64 = await compressImage(file, { maxWidth: 300, maxHeight: 300, quality: 0.85 })
    form.value.avatar_url = compressedBase64
  } catch (err) {
    alert(err.message || 'Erro ao carregar a imagem.')
  }
}

const saveProfessional = async () => {
  const payload = {
    name: form.value.name,
    specialty: form.value.specialty,
    phone: form.value.phone,
    avatar_url: form.value.avatar_url,
    service_ids: form.value.service_ids,
    active: form.value.active
  }

  if (editingId.value) {
    await dataService.updateProfessional(editingId.value, payload)
  } else {
    await dataService.addProfessional(payload, orgId.value)
  }

  cancelEdit()
  await loadData()
}

const editProfessional = (professional) => {
  editingId.value = professional.id
  form.value = {
    name: professional.name,
    specialty: professional.specialty,
    phone: professional.phone || '',
    avatar_url: professional.avatar_url || '',
    service_ids: Array.isArray(professional.service_ids) ? [...professional.service_ids] : [],
    active: professional.active ?? true
  }
}

const cancelEdit = () => {
  editingId.value = null
  form.value = {
    name: '',
    specialty: '',
    phone: '',
    avatar_url: '',
    service_ids: [],
    active: true
  }
}

const deleteProfessional = async (id) => {
  if (confirm('Tem certeza que deseja excluir este profissional?')) {
    await dataService.deleteProfessional(id)
    await loadData()
    if (editingId.value === id) cancelEdit()
  }
}

const logout = () => {
  localStorage.removeItem('agendaflex_admin_session')
  window.location.href = '/admin/login'
}
</script>
