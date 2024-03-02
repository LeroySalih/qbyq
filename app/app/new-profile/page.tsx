"use client";

import {useState, useEffect} from 'react';
//import {useSupabase } from "components/context/supabase-context";
import supabase from "app/utils/supabase/client";
import {useRouter} from 'next/navigation';
import { User } from '@supabase/supabase-js';
import styles from './new-profile.module.css';
import ClassList from './class-list';

const NewProfilePage = () => {

    const [firstName, setFirstName] = useState<string>('');
    const [familyName, setFamilyName] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState(null);

    // const {supabase} = useSupabase();

    useEffect(()=> {
        const loadUser = async () => {
            const {data: {user}} = await supabase.auth.getUser()
            //@ts-ignore
            setUser(user);
        }
        
        loadUser();

    }, []);

    useEffect(()=>{

        const loadProfile = async () => {
            if (!user)
                return;
            console.log(user)
            const {data, error} = await supabase.from("Profile").select().eq("id", user!.id).maybeSingle();

            error && console.error(error);

            if (data) {
                const {firstName, familyName } = data;
                //@ts-ignore
                // setProfile(data);
                setFirstName(firstName);
                setFamilyName(familyName);
            }
        }

        loadProfile();
    }, [user])

    const router = useRouter();

    const handleOnClick = async () => {

        if (!user)
            return;

        const id = user.id;

        const upsertObj = {id, firstName, familyName, isAdmin: false};

        console.log("Upsert Object", upsertObj); 

        const {data, error} = await supabase
                                .from("Profile")
                                .upsert(upsertObj)
                                .select()
                                ;

        console.log("Upsert result", data)

        error && console.error(error);


    }

    return <>
            <h1>Profile Page</h1>
            
            <div className={styles.formLayout}>
                <div>First name:</div>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                <div>Family name:</div>
                <input value={familyName} onChange={(e) => setFamilyName(e.target.value)}/>
                <div>
                    <button onClick={handleOnClick}>Save</button>
                </div>
            </div>
            <div className={styles.classesLayout}>
                <h3>Classes</h3>
                
                {user && <ClassList userid={user.id}/>}

                
            </div>
            
            </>
    
}

export default NewProfilePage;