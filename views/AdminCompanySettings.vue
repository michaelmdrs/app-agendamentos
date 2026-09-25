<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <div class="bg-white p-4 rounded-xl shadow flex justify-between items-center">
        <div>
          <h1 class="text-xl font-bold text-gray-800">Configuração da Empresa</h1>
          <p class="text-xs text-gray-500">Personalize nome, logo, capa e identidade visual do seu negócio.</p>
        </div>
        <div class="flex gap-2">
          <router-link to="/admin" class="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold border border-gray-200">
            Voltar ao painel
          </router-link>
          <router-link to="/" class="text-xs bg-brand-50 text-brand-600 px-3 py-2 rounded-lg font-bold border border-brand-200">
            Ver cliente
          </router-link>
        </div>
      </div>

      <div class="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div class="bg-white rounded-xl shadow p-6">
          <form @submit.prevent="saveSettings" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <label class="block text-sm font-medium text-gray-700">
                Nome da empresa
                <input v-model="form.name" class="mt-1 w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
              </label>

              <label class="block text-sm font-medium text-gray-700">
                Telefone
                <input v-model="form.phone" class="mt-1 w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
              </label>
            </div>

            <label class="block text-sm font-medium text-gray-700">
              Endereço
              <input v-model="form.address" class="mt-1 w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
            </label>

            <label class="block text-sm font-medium text-gray-700">
              Logo URL
              <input v-model="form.logo_url" class="mt-1 w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
            </label>

            <label class="block text-sm font-medium text-gray-700">
              Banner URL
              <input v-model="form.banner_url" class="mt-1 w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
            </label>

            <label class="block text-sm font-medium text-gray-700">
              Cor principal
              <div class="mt-1 flex gap-3 items-center">
                <input type="color" v-model="form.primary_color" class="h-12 w-16 border rounded-lg cursor-pointer" />
                <span class="text-sm text-gray-500">{{ form.primary_color }}</span>
              </div>
            </label>

            <div class="flex gap-3 pt-2">
              <button type="submit" :style="{ backgroundColor: form.primary_color }" class="px-5 py-3 rounded-xl text-white font-bold shadow hover:opacity-90 transition">
                Salvar configuração
              </button>
              <button type="button" @click="resetForm" class="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition">
                Restaurar padrão
              </button>
            </div>

            <p v-if="savedMessage" class="text-sm text-green-600 font-medium">{{ savedMessage }}</p>
          </form>
        </div>

        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Pré-visualização</h2>

          <div class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <div class="relative h-24 w-full overflow-hidden">
              <img :src="form.banner_url || 'https://via.placeholder.com/800x300'" alt="Banner" class="w-full h-full object-cover" />
            </div>
            <div class="px-4 pb-4 pt-0 -mt-8">
              <div class="w-16 h-16 rounded-full border-4 border-white bg-white overflow-hidden mx-auto shadow-md">
                <img :src="form.logo_url || 'https://via.placeholder.com/150'" alt="Logo" class="w-full h-full object-cover" />
              </div>
              <div class="text-center mt-2">
                <h3 class="font-black text-lg text-gray-900">{{ form.name }}</h3>
                <p class="text-xs text-gray-500">{{ form.address }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <p class="text-sm font-semibold text-gray-700 mb-2">Amostra de botão</p>
            <button :style="{ backgroundColor: form.primary_color }" class="w-full py-3 text-white font-bold rounded-xl shadow">
              Agendar agora
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../services/mockStorage'

const form = ref({
  name: '',
  phone: '',
  address: '',
  logo_url: '',
  banner_url: '',
  primary_color: '#0284c7'
})

const savedMessage = ref('')

const defaultBrand = {
  id: 'org-1',
  name: 'Barbearia & Estilo Griffs',
  slug: 'barbeariagriffs',
  phone: '(11) 99999-8888',
  address: 'Rua das Flores, 123 - Centro',
  logo_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150&auto=format&fit=crop&q=80',
  banner_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
  primary_color: '#0284c7'
}

const loadSettings = () => {
  const data = db.get()
  form.value = { ...defaultBrand, ...data.organization }
}

onMounted(() => {
  loadSettings()
})

const saveSettings = () => {
  db.updateOrganization(form.value)
  savedMessage.value = 'Configuração salva com sucesso!'
}

const resetForm = () => {
  form.value = { ...defaultBrand }
  db.updateOrganization(form.value)
  savedMessage.value = 'Valores restaurados para o padrão inicial.'
}
</script>
