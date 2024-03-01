'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

import type { SupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from 'types/supabase';
import supabase from "app/utils/supabase/client";

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Change")
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <Context.Provider value={{supabase}}>
    <>{children}</>
  </Context.Provider>
} 

export const useSupabase = () => {

  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }

  return context;
  
}



  