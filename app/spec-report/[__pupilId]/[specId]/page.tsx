"use client";
import styles from "./page.module.css";

import { useSupabase } from 'components/context/supabase-context';

import { useEffect, useState, useContext, Profiler } from 'react';

import Link from 'next/link';

import Card from "components/card";
import DisplaySpecDataByMarks from './display-spec-data-by-marks';  
import DisplaySpecProgress from './display-spec-progress';
import DisplaySpecDataByItem from './dispaly-spec-data-by-item';

import {User} from "@supabase/supabase-js";
import {Profile} from "types/alias";

type SpecReportType = {
    params : {
        __pupilId : string
        specId: number
    }
}
const SpecReport = ({params}: SpecReportType) => {

    const {__pupilId, specId} = params;
    const {supabase} = useSupabase();

    //const {profile, classes, pupilMarks} = useContext(UserContext);

    const [user, setUser] = useState<User | null>(null);


    const [currentClassId, setCurrentClassId] = useState(0);
    const [pupilId, setPupilId] = useState(__pupilId);

    const [allClasses, setAllClasses] = useState(null);
    const [allPupils, setAllPupils] = useState(null);
    const [pupilMarks, setPupilMarks] = useState(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    const getAllClasses = async () => {
        const {data:classes, error} = await supabase.from("Classes").select()

        
        // console.log("Classes", classes);

        error && console.error(error);

        if (!classes)
            return;

        //@ts-ignore
        setAllClasses(classes);
        setCurrentClassId(classes[0].id)
    }


    const getAllPupils = async (classId: number) => {

        
        const {data:pupils, error} = (await supabase
            .from("ClassMembership")
            .select("*, Classes(*), Profile(*)")
            .eq("classId", classId));

        if (!pupils)
            return;
            

        console.log("pupils", pupils);

        error && console.error(error);

        const tmp = pupils.map((p, i) => ({ 
            pupilId: p.pupilId,
            // @ts-ignore 
            classTitle: p.Classes?.title, 
            // @ts-ignore
            firstName: p.Profile?.firstName, 
            // @ts-ignore
            familyName: p.Profile?.familyName
        }))

        //setPupilId(tmp[0]?.id)

        // @ts-ignore
        setAllPupils(tmp);

        if (tmp.length > 0){
            setPupilId(tmp[0].pupilId);
        }
    }

    const loadUser = async () => {
        const {data: {user}} = await supabase.auth.getUser();
        setUser(user);
    }

    const loadProfile = async () => {
        if (!user)
            return;

        const {data, error} = await supabase.from("Profile").select().eq("id", user.id).single();

        error && console.error(error);

        setProfile(data);
    }

    useEffect(()=> {
        loadUser();

        const {data} = supabase.auth.onAuthStateChange((event, session) => {
            if (session && session.user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return data.subscription.unsubscribe();

    }, []);


    useEffect(()=> {
        console.log("User Changed to", user);
        if (!user){
            return;
        }

        loadProfile();
    }, [user])

    useEffect(()=> {
        console.log("Profile Changed to", profile);
        console.log("specId Changed to", specId);


         if (profile && profile.isAdmin) {
            getAllClasses();
         }
        
        
    }, [profile, specId]);


    useEffect(()=> {

        if (profile && profile.isAdmin) {
            getAllPupils(currentClassId);
        }

    }, [profile, allClasses, currentClassId]);


    const getSpecId = (classId: number) => {
        if (!allClasses)  
            return null;

        console.log("allClasses", allClasses, classId)
        //@ts-ignore
        return allClasses.filter((c) => c.id == classId)[0].specId;

    }

    return <>
        <div><Link href="/">Home</Link></div>
        
        
        <h1>
            <span>Spec Report for </span>
        
            { profile && (
                (!profile?.isAdmin) && `${profile?.firstName} ${profile?.familyName}`)
            }
            
            {profile && profile.isAdmin && 
                <span>
                    {allClasses && 
                        <select value={currentClassId} onChange={(e) => {setCurrentClassId(parseInt(e.target.value))}}>
                            {
                                //@ts-ignore
                                allClasses.map((ac, i) => <option value={ac.id} key={i}>{ac.title}</option>)}
                        </select>
                    }

                    {allPupils && 
                        <select value={pupilId} onChange={(e) => {setPupilId(e.target.value)}}>
                            {
                                //@ts-ignore
                                allPupils.map((p, i) => <option value={p.pupilId} key={i}>{p.firstName} {p.familyName}</option>)}
                        </select>
                    }
                </span>
            }
            
        
        </h1>
        <hr></hr>
        <div className={styles.display}>
            <div style={{gridArea:"a"}}>
                {
                    <DisplaySpecProgress pupilId={pupilId} specId={getSpecId(currentClassId)}/>
                }
            </div>
            <div style={{gridArea:"c"}}>
                {
                <DisplaySpecDataByMarks pupilId={pupilId} specId={getSpecId(currentClassId)}/>
                }
                </div>
            <div style={{gridArea:"b"}}>
                {//@ts-ignore
                allClasses && allPupils && <DisplaySpecDataByItem pupilId={pupilId} specId={getSpecId(currentClassId)}/>
                }
            </div>
        
        </div>
    </>
}


export default SpecReport;






