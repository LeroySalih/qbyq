"use client"


import { createBrowserClient} from '@supabase/ssr'
import { Database } from '../../../types/supabase';


const supabaseKey = String(process.env.NEXT_PUBLIC_SUPABASE_KEY)
const supabaseUrl = String(process.env.NEXT_PUBLIC_SUPABASE_URL)

// const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const supabase = createBrowserClient<Database>(
    supabaseUrl,
    supabaseKey
  )


export default supabase;

/*
https://supabase.com/docs/guides/api/generating-types
*/