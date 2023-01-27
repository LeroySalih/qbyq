"use client"
import { User } from '@supabase/supabase-js';
import {useState, useEffect, createContext} from 'react';
import { Database } from 'types/supabase';
import supabase from '../components/supabase'
import { UserContextType, UserContext } from 'components/context/user-context';
import { Profile } from 'types/alias';
import { useRouter } from 'next/navigation'

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import './globals.css'


export default function RootLayout({children,}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  const router = useRouter();

  useEffect(()=> {

    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user || undefined);
    }

    loadUser();

    supabase.auth.onAuthStateChange((event, session) => {
     // setUser(session?.user);
    })
  
  }, []);

  useEffect(()=> {

    const loadProfile = async () => {
      if (user) {
        
        const {data: profile, error} = await supabase.from("Profile").select().eq("userId", user.id);

        console.log(profile, user.id);
        
        if (profile === null){
          router.push('/new-profile')
        } else {
            setProfile((profile![0] || []));
        }
        
        

      } 
    }
    
    loadProfile();
    
  }, [user])

  
  return (
    <html>
      <head />
      <UserContext.Provider value={{user, profile}}>
        <body>{children}</body>
      </UserContext.Provider>
    </html>
  )
}
