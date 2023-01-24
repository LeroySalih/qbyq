"use client"

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
          <p>Profile</p>
          <div>Welcome, </div> 
          <pre>{JSON.stringify(spec, null, 2)}</pre>
        </>
    )
}

export default MainPage;