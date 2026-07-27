import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Відсутні змінні оточення VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'Створіть файл .env на основі .env.example і заповніть значення з панелі Supabase.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)