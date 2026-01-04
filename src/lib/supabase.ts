import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for CV tables
export interface CvProfile {
  id: string
  full_name: string | null
  background_raw: string | null
  created_at: string
  updated_at: string
}

export interface CvGeneration {
  id: string
  user_id: string
  job_description: string | null
  generated_cv: string
  model_used: string
  created_at: string
}
