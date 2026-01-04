import { createBrowserClient } from '@supabase/ssr'

// Browser client - use in client components
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

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
