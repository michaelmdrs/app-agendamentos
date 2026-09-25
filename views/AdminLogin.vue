<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-6">
        <div class="mx-auto mb-4 h-16 w-16 rounded-full bg-brand-100 flex items-center justify-center text-2xl font-bold text-brand-700">
          🔒
        </div>
        <h1 class="text-2xl font-black text-gray-900">Acesso do Administrador</h1>
        <p class="text-sm text-gray-500 mt-2">Entre para gerenciar agendamentos, profissionais e personalização.</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input v-model="email" type="email" placeholder="admin@agendaflex.com" class="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input v-model="password" type="password" placeholder="admin123" class="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        <button type="submit" class="w-full py-3 rounded-xl bg-brand-600 text-white font-bold shadow hover:bg-brand-700 transition">
          Entrar
        </button>

        <p v-if="errorMessage" class="text-sm text-red-600 font-medium">{{ errorMessage }}</p>
      </form>

      <div class="mt-6 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
        <p class="font-semibold mb-1">Credenciais de demonstração:</p>
        <p>E-mail: admin@agendaflex.com</p>
        <p>Senha: admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../services/auth'

const router = useRouter()
const email = ref('admin@agendaflex.com')
const password = ref('admin123')
const errorMessage = ref('')

const handleLogin = () => {
  const ok = auth.login({ email: email.value, password: password.value })

  if (!ok) {
    errorMessage.value = 'E-mail ou senha inválidos.'
    return
  }

  router.push('/admin')
}
</script>
