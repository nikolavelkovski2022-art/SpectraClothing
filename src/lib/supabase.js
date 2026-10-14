const environment = import.meta.env ?? {}
const supabaseUrl = environment.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = environment.VITE_SUPABASE_ANON_KEY?.trim()

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let clientPromise

export function getSupabaseClient() {
  if (!isSupabaseConfigured) return Promise.resolve(null)
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) => createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }))
  }
  return clientPromise
}
