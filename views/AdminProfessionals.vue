<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Profissionais</h1>
          <p class="text-xs text-gray-500">Cadastre, edite e ative os profissionais da sua agenda.</p>
        </div>

        <div class="flex gap-2">
          <router-link to="/admin" class="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold border border-gray-200">
            Voltar ao painel
          </router-link>
          <router-link to="/admin/configuracao" class="text-xs bg-brand-50 text-brand-600 px-3 py-2 rounded-lg font-bold border border-brand-200">
            Configuração
          </router-link>
        </div>
      </div>

      <div class="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-4">{{ editingId ? 'Editar profissional' : 'Novo profissional' }}</h2>

          <form @submit.prevent="saveProfessional" class="space-y-4">
            <label class="block text-sm font-medium text-gray-700">
              Nome
              <input v-model="form.name" class="mt-1 w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" required />
            </label>

            <label class="block text-sm font-medium text-gray-700">
              Especialidade
              <input v-model="form.specialty" class="mt-1 w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" placeholder="Ex: Barbeiro, Designer, Psicólogo" required />
            </label>

            <label class="block text-sm font-medium text-gray-700">
              WhatsApp / Telefone
              <input v-model="form.phone" class="mt-1 w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
            </label>

            <label class="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" v-model="form.active" class="h-4 w-4" />
              Profissional ativo
            </label>

            <div class="flex gap-2 pt-2">
              <button type="submit" class="px-4 py-3 rounded-xl bg-brand-600 text-white font-bold shadow hover:bg-brand-700 transition">
                {{ editingId ? 'Salvar alterações' : 'Adicionar profissional' }}
              </button>
              <button v-if="editingId" type="button" @click="cancelEdit" class="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition">
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <div class="bg-white rounded-xl shadow overflow-hidden">
          <div class="p-4 border-b bg-gray-50 font-bold text-gray-700 flex justify-between items-center">
            <span>Lista de profissionais</span>
            <span class="text-xs bg-gray-200 px-2 py-1 rounded-md text-gray-700">{{ professionals.length }}</span>
          </div>

          <div v-if="professionals.length === 0" class="p-8 text-center text-gray-400 text-sm">
            Nenhum profissional cadastrado ainda.
          </div>

          <div v-else class="divide-y">
            <div v-for="professional in professionals" :key="professional.id" class="p-4 flex flex-col md:flex-row justify-between gap-3 md:items-center">
              <div>
                <p class="font-bold text-gray-900">{{ professional.name }}</p>
                <p class="text-xs text-gray-500">{{ professional.specialty }}</p>
                <p class="text-xs text-gray-400">{{ professional.phone || 'Telefone não informado' }}</p>
              </div>

              <div class="flex items-center gap-2">
                <span :class="['px-2.5 py-1 text-xs font-bold rounded-full', professional.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600']">
                  {{ professional.active ? 'Ativo' : 'Inativo' }}
                </span>
                <button @click="editProfessional(professional)" class="text-xs text-brand-600 font-semibold hover:underline">
                  Editar
                </button>
                <button @click="deleteProfessional(professional.id)" class="text-xs text-red-600 font-semibold hover:underline">
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
import { db } from '../services/mockStorage'

const professionals = ref([])
const editingId = ref(null)
const form = ref({
  name: '',
  specialty: '',
  phone: '',
  active: true
})

const loadProfessionals = () => {
  professionals.value = db.getProfessionals()
}

onMounted(() => {
  loadProfessionals()
})

const saveProfessional = () => {
  if (editingId.value) {
    db.updateProfessional(editingId.value, { ...form.value })
  } else {
    db.addProfessional({ ...form.value })
  }

  cancelEdit()
  loadProfessionals()
}

const editProfessional = (professional) => {
  editingId.value = professional.id
  form.value = { ...professional }
}

const cancelEdit = () => {
  editingId.value = null
  form.value = {
    name: '',
    specialty: '',
    phone: '',
    active: true
  }
}

const deleteProfessional = (id) => {
  db.deleteProfessional(id)
  loadProfessionals()
  if (editingId.value === id) cancelEdit()
}
</script>
