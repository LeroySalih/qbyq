"use client"

import Link from 'next/link';
import React, { useContext } from 'react'
import {useState, useEffect} from 'react';
import { Database } from 'types/supabase';
import supabase from '../components/supabase';
import { Spec } from 'types/alias';
import { UserContextType, UserContext } from 'components/context/user-context';
import { Profile } from 'types/alias';
import { useRouter } from 'next/navigation'

/*
type ProfileProps = {
    profile: {
    firstName: string,
    lastName: string,
    age: number,
    }
}
*/

type ProfileProps = {}



const MainPage: React.FunctionComponent<ProfileProps> = (): JSX.Element => {
    
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [spec, setSpec] = useState<Spec | null>(null);
    const {user, profile} = useContext<UserContextType>(UserContext);

    const router = useRouter();

    // https://1f34-51-252-20-183.in.ngrok.io/paper-form

    useEffect(() => {
        const loadData = async () => {
            
            const {data, error} = await supabase.from('Spec').select("*").eq("id", 1).limit(1).single();

            error && console.error(error);

            setSpec(data);
        };

        loadData();

        
    }, []);


    

    


    return (
        <>
        
         <Link href="/auth">Auth</Link>
          <p>Profile</p>
          <div>Welcome, {profile?.firstName}</div> 
          <h1>Spec Data</h1>
          <hr/>
          <pre>{JSON.stringify(spec, null, 2)}</pre>

          {user && <Link href="/paper-form">Fill Out a form</Link>}
          <h1>User Data</h1>
          <hr/>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </>
    )
}

export default MainPage;