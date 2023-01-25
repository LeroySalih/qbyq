"use client"
import { User } from '@supabase/supabase-js';
import {useState, useEffect, createContext} from 'react';
import { Database } from 'types/supabase';
import supabase from '../components/supabase'
import { UserContextType, UserContext } from 'components/context/user-context';


export default function RootLayout({children,}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(()=> {

    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user || undefined);
    }

    loadUser();

    supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
     // setUser(session?.user);
    })
  
  }, [])
  return (
    <html>
      <head />
      <UserContext.Provider value={{user}}>
        <body>{children}</body>
      </UserContext.Provider>
    </html>
  )
}
