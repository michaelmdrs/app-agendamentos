import { createClient } from '@supabase/supabase-js'

const cleanEnv = (val) => (val || '').trim().replace(/^["']|["']$/g, '').trim()

const rawUrl = cleanEnv(import.meta.env.VITE_SUPABASE_URL)
const supabaseAnonKey = cleanEnv(import.meta.env.VITE_SUPABASE_ANON_KEY)

// Remove automaticamente qualquer sufixo '/rest/v1' ou barra final da URL
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('seu-projeto')
)

export const supabaseDiagnostics = {
  hasUrl: Boolean(supabaseUrl),
  urlPreview: supabaseUrl ? (supabaseUrl.slice(0, 22) + '...') : '',
  hasKey: Boolean(supabaseAnonKey),
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
  isConfigured: isSupabaseConfigured
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
