"use client"

import {createClient} from '@supabase/supabase-js';
import { Database } from '../../types/supabase';

const supabaseKey = String(process.env.NEXT_PUBLIC_SUPABASE_KEY)
const supabaseUrl = String(process.env.NEXT_PUBLIC_SUPABASE_URL)

const supabase = createClient<Database>(supabaseUrl, supabaseKey);



export default supabase;

/*
https://supabase.com/docs/guides/api/generating-types
*/