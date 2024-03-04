import { createServerClient, type CookieOptions } from '@supabase/ssr'


import {cookies} from 'next/headers';

export const  createSupabaseServerClient = (inServerAction = true) => {
    const supabaseUrl:string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey:string = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

    const cookieStore = cookies()

    return createServerClient(
        supabaseUrl,
        supabaseKey,
        {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            if (!inServerAction) return;
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            if (!inServerAction) return;
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
}


