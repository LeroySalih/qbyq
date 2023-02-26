"use client"
import { User } from '@supabase/supabase-js';
import {useState, useEffect, createContext} from 'react';
import { Database } from 'types/supabase';
import supabase from '../components/supabase'
import { UserContextType, UserContext } from 'components/context/user-context';
import { Profile, ClassMembershipData } from 'types/alias';
import { useRouter } from 'next/navigation'

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import './globals.css'

import { getClasses, GetClassesResponseType, getAllPupilMarks, GetAllPupilMarks  } from 'lib';

export default function RootLayout({children,}: {children: React.ReactNode}) {

  const [user, setUser] = useState<User | undefined>(undefined);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [classes, setClasses] = useState<GetClassesResponseType>(null);
  const [pupilMarks, setPupilMarks] = useState<GetAllPupilMarks>(null);

  const router = useRouter();

  const loadClasses = async () => {
    if (user){
      
      const data = await getClasses(user.id);

      console.log("Classes", data);

      setClasses(data);
    }
  }

  const loadPupilMarks = async () => {
    
    if (user) {

      const  data = await getAllPupilMarks(user.id);

      console.log("Pupil Marks", data);

      setPupilMarks(data);

    }
    
  }

  const loadProfile = async () => {
    if (user) {
      
      const {data:profile, error} = await supabase.from("Profile")
                                            .select()
                                            .eq("id", user.id);

      error && console.error(error)
      

      if (profile === null){
          router.push('/new-profile')
      } else {
          setProfile((profile![0] || []));
      }
      
      

    } 
  }


  useEffect(()=> {

    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user || undefined);
    }

    loadUser();

    supabase.auth.onAuthStateChange((event, session) => {
      // console.log(event, session)
      // setUser(session?.user);
    })
  
  }, []);

  useEffect(()=> {
    console.log("User useEffect", user);

    if (user === undefined)
      return;

    loadProfile();
    loadClasses();
    loadPupilMarks(); 
    
  }, [user])

  
  return (
    <html>
      <head />
      <UserContext.Provider value={{user, profile, classes, pupilMarks, loadClasses}}>
        <body>{children}</body>
      </UserContext.Provider>
    </html>
  )
}
