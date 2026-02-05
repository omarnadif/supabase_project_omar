import { createClient } from '@supabase/supabase-js'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabaseKey as string
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL o Key sont pas définis dans les variables d\'environnement.')
  }
  return createClient(supabaseUrl, supabaseKey)
}
