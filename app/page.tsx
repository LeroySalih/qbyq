"use client"
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import React from 'react'
import {useState, useEffect} from 'react';
import { Database } from 'types/supabase';
import supabase from '../components/supabase'
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
type Spec = Database["public"]["Tables"]["Spec"]["Row"];


const MainPage: React.FunctionComponent<ProfileProps> = (): JSX.Element => {
    
    const [spec, setSpec] = useState<Spec | null>(null);
    const [user, setUser] = useState<User | undefined>(undefined);

    

    useEffect(() => {
        const loadData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user || undefined);

            const {data, error} = await supabase.from('Spec').select("*").eq("id", 1).limit(1).single();

            error && console.error(error);

            setSpec(data);
        };

        loadData();

        supabase.auth.onAuthStateChange((event, session) => {
            console.log(event, session);
           // setUser(session?.user);
        })
    }, []);

    


    return (
        <>

        
         <Link href="/auth">Auth</Link>
          <p>Profile</p>
          <div>Welcome, </div> 
          <h1>Spec Data</h1>
          <hr/>
          <pre>{JSON.stringify(spec, null, 2)}</pre>
          <h1>User Data</h1>
          <hr/>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
    )
}

export default MainPage;