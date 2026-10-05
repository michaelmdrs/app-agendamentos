import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Carrega variáveis do arquivo .env e do ambiente (Vercel)
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  // Aceita variáveis com ou sem o prefixo VITE_ (muito comum em integrações do Supabase na Vercel)
  const rawUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || ''
  const cleanUrl = rawUrl.trim().replace(/^["']|["']$/g, '').replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')

  const rawKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_KEY || ''
  const cleanKey = rawKey.trim().replace(/^["']|["']$/g, '')

  return {
    plugins: [vue()],
    envPrefix: ['VITE_', 'SUPABASE_'],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(cleanUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(cleanKey)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173
    },
    preview: {
      host: '0.0.0.0',
      port: 4173
    }
  }
})