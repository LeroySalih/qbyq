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
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext'; 

import { Class } from 'types/alias';
import AddClass, {OnAddHandler} from 'components/add-class';
import { GetClassesResponseType } from 'lib';
import DisplayClasses from 'components/display-classes';

type ProfileProps = {}

const MainPage: React.FunctionComponent<ProfileProps> = (): JSX.Element => {
    
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [spec, setSpec] = useState<Spec | null>(null);
    const {user, profile, classes, loadClasses} = useContext<UserContextType>(UserContext);

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


    const handleCheckClick = () => {

    }

    type ClassParam = Class | null | undefined;

    const handleOnAddClass = async (c:ClassParam) => {

        const {data, error} = await supabase.from("ClassMembership")
                                            .insert({classId: c!.id, pupilId: user!.id})
                                            .select()

        error && console.error(error);
        
        loadClasses!()        
    }




    return (
        <>
        <div className="page">
         <Link href="/auth">
            {user && <span>Sign Out</span> }
            
        </Link>

          {!user && 
            <div>
                <h1>Question By Question (QbyQ)</h1>
                <h3>Click here to sign in</h3>
                <Link href="/auth">Sign In</Link>
            </div>
          }

          {
            user && <><h1>Welcome, {profile?.firstName}</h1> 
            <div>
              <h3>Join Class</h3>
              <AddClass onAdd={handleOnAddClass}/>
              {/*
              //@ts-ignore */}
              <DisplayClasses classes={classes}/>
            </div>
            </>
          }
          
          
          </div>
        </>
    )
}

export default MainPage;