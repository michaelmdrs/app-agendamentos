<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      
      <!-- Top Bar com Navegação -->
      <div class="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold text-gray-800">Configuração da Empresa</h1>
            <span v-if="isMock" class="text-[11px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
              Mock Local
            </span>
            <span v-else class="text-[11px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full border border-green-200">
              PostgreSQL Conectado
            </span>
          </div>
          <p class="text-xs text-gray-500">Personalize o logotipo, capa, cores e informações do seu negócio.</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <router-link to="/admin" class="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold border border-gray-200 hover:bg-gray-200 transition">
            Agendamentos
          </router-link>
          <router-link to="/admin/servicos" class="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold border border-gray-200 hover:bg-gray-200 transition">
            Serviços
          </router-link>
          <router-link to="/admin/profissionais" class="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold border border-gray-200 hover:bg-gray-200 transition">
            Profissionais
          </router-link>
          <router-link to="/admin/configuracao" class="text-xs bg-brand-600 text-white px-3 py-2 rounded-lg font-bold border border-brand-600 transition">
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

      <!-- Configurações e Preview -->
      <div class="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        
        <!-- Formulário -->
        <div class="bg-white rounded-xl shadow p-6">
          <form @submit.prevent="saveSettings" class="space-y-4">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                <input v-model="form.name" placeholder="Ex: Barbearia & Estilo" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" required />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp de Contato</label>
                <input v-model="form.phone" placeholder="(11) 99999-8888" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" required />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
              <input v-model="form.address" placeholder="Rua, Número, Bairro - Cidade" class="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            <!-- Upload Local de Logotipo -->
            <div class="p-3 border rounded-xl bg-gray-50/50 space-y-2">
              <div class="flex justify-between items-center">
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wide">Logotipo da Empresa</label>
                <button
                  type="button"
                  @click="showLogoUrlInput = !showLogoUrlInput"
                  class="text-[11px] text-brand-600 hover:underline"
                >
                  {{ showLogoUrlInput ? 'Ocultar Link URL' : 'Inserir via Link URL' }}
                </button>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-14 h-14 rounded-full border border-gray-300 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                  <img v-if="form.logo_url" :src="form.logo_url" alt="Logo" class="w-full h-full object-cover" />
                  <span v-else class="text-xs text-gray-400">Sem logo</span>
                </div>

                <div class="space-y-1">
                  <label class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-lg border border-gray-300 shadow-sm transition">
                    <span>📁 Upload de Imagem Local</span>
                    <input type="file" accept="image/*" @change="handleLogoUpload" class="hidden" />
                  </label>
                  <p class="text-[11px] text-gray-400">PNG, JPG, WEBP (Comprimido automaticamente)</p>
                </div>
              </div>

              <div v-if="showLogoUrlInput" class="pt-2">
                <input v-model="form.logo_url" placeholder="Ou cole a URL direta da imagem (https://...)" class="w-full p-2.5 text-xs border rounded-lg bg-white" />
              </div>
            </div>

            <!-- Upload Local de Banner / Imagem de Capa -->
            <div class="p-3 border rounded-xl bg-gray-50/50 space-y-2">
              <div class="flex justify-between items-center">
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wide">Banner / Imagem de Capa</label>
                <button
                  type="button"
                  @click="showBannerUrlInput = !showBannerUrlInput"
                  class="text-[11px] text-brand-600 hover:underline"
                >
                  {{ showBannerUrlInput ? 'Ocultar Link URL' : 'Inserir via Link URL' }}
                </button>
              </div>

              <div class="space-y-2">
                <div v-if="form.banner_url" class="relative h-20 w-full rounded-lg overflow-hidden border border-gray-200">
                  <img :src="form.banner_url" alt="Banner Capa" class="w-full h-full object-cover" />
                  <button
                    type="button"
                    @click="form.banner_url = ''"
                    class="absolute top-1 right-1 bg-black/60 text-white rounded px-2 py-0.5 text-[10px] hover:bg-black"
                  >
                    Remover Capa
                  </button>
                </div>

                <label class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-lg border border-gray-300 shadow-sm transition">
                  <span>📁 Upload de Imagem Local de Capa</span>
                  <input type="file" accept="image/*" @change="handleBannerUpload" class="hidden" />
                </label>
                <p class="text-[11px] text-gray-400">Dimensão recomendada: 800x300 ou similar</p>
              </div>

              <div v-if="showBannerUrlInput" class="pt-2">
                <input v-model="form.banner_url" placeholder="Ou cole a URL da imagem de capa (https://...)" class="w-full p-2.5 text-xs border rounded-lg bg-white" />
              </div>
            </div>

            <!-- Cor Principal -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cor Principal da Marca</label>
              <div class="flex gap-3 items-center">
                <input type="color" v-model="form.primary_color" class="h-11 w-16 border rounded-lg cursor-pointer p-0.5" />
                <span class="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border">{{ form.primary_color }}</span>
              </div>
            </div>

            <div class="flex gap-3 pt-3">
              <button
                type="submit"
                :style="{ backgroundColor: form.primary_color }"
                class="px-5 py-3 rounded-xl text-white font-bold shadow hover:opacity-90 transition flex-1"
              >
                Salvar Configurações
              </button>
              <button
                type="button"
                @click="resetForm"
                class="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
              >
                Restaurar Padrão
              </button>
            </div>

            <p v-if="savedMessage" class="text-sm text-green-600 font-bold bg-green-50 p-2.5 rounded-lg border border-green-200">
              ✓ {{ savedMessage }}
            </p>
          </form>
        </div>

        <!-- Preview em Tempo Real -->
        <div class="bg-white rounded-xl shadow p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Pré-visualização</h2>

          <div class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <div class="relative h-28 w-full overflow-hidden bg-gray-800">
              <img :src="form.banner_url || 'https://via.placeholder.com/800x300'" alt="Banner" class="w-full h-full object-cover opacity-80" />
            </div>
            <div class="px-4 pb-4 pt-0 -mt-10 relative">
              <div class="w-20 h-20 rounded-full border-4 border-white bg-white overflow-hidden mx-auto shadow-md">
                <img :src="form.logo_url || 'https://via.placeholder.com/150'" alt="Logo" class="w-full h-full object-cover" />
              </div>
              <div class="text-center mt-2">
                <h3 class="font-black text-lg text-gray-900">{{ form.name || 'Nome do Negócio' }}</h3>
                <p class="text-xs text-gray-500 mt-0.5">📍 {{ form.address || 'Endereço não informado' }}</p>
                <p class="text-xs text-gray-400 mt-0.5">📞 {{ form.phone || '(00) 00000-0000' }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 space-y-2">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Amostra do Botão do Cliente</p>
            <button
              :style="{ backgroundColor: form.primary_color }"
              class="w-full py-3.5 text-white font-bold rounded-xl shadow hover:opacity-90 transition text-sm"
            >
              Avançar para Horários
            </button>
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

const form = ref({
  id: '',
  name: '',
  phone: '',
  address: '',
  logo_url: '',
  banner_url: '',
  primary_color: '#0284c7'
})

const savedMessage = ref('')
const showLogoUrlInput = ref(false)
const showBannerUrlInput = ref(false)
const isMock = ref(dataService.isUsingMock())

const defaultBrand = {
  id: 'a0000000-0000-0000-0000-000000000001',
  name: 'Barbearia & Estilo Griffs',
  slug: 'barbeariagriffs',
  phone: '(11) 99999-8888',
  address: 'Rua das Flores, 123 - Centro',
  logo_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150&auto=format&fit=crop&q=80',
  banner_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
  primary_color: '#0284c7'
}

const loadSettings = async () => {
  const org = await dataService.getOrganization()
  form.value = { ...defaultBrand, ...org }
}

onMounted(() => {
  loadSettings()
})

const handleLogoUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const compressed = await compressImage(file, { maxWidth: 300, maxHeight: 300, quality: 0.85 })
    form.value.logo_url = compressed
  } catch (err) {
    alert(err.message || 'Erro ao carregar imagem de logotipo.')
  }
}

const handleBannerUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const compressed = await compressImage(file, { maxWidth: 1000, maxHeight: 450, quality: 0.8 })
    form.value.banner_url = compressed
  } catch (err) {
    alert(err.message || 'Erro ao carregar imagem de capa.')
  }
}

const saveSettings = async () => {
  await dataService.updateOrganization(form.value)
  savedMessage.value = 'Configurações salvas com sucesso!'
  setTimeout(() => {
    savedMessage.value = ''
  }, 4000)
}

const resetForm = async () => {
  if (confirm('Restaurar os dados da empresa para os padrões de demonstração?')) {
    form.value = { ...defaultBrand }
    await dataService.updateOrganization(form.value)
    savedMessage.value = 'Valores restaurados para o padrão inicial.'
  }
}

const logout = () => {
  localStorage.removeItem('agendaflex_admin_session')
  window.location.href = '/admin/login'
}
</script>
