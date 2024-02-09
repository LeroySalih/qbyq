"use client";
import 'react-data-grid/lib/styles.css';
import styles from "./page.module.css";

import { useSupabase } from 'components/context/supabase-context';

import { useEffect, useState, useContext, Profiler } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import Card from "components/card";
import DisplaySpecDataByMarks from './display-spec-data-by-marks';  
import DisplaySpecProgress from './display-spec-progress';
import DisplaySpecDataByItem from './dispaly-spec-data-by-item';
import DisplayPapersForPupil from './display-papers-for-pupil';

import {User} from "@supabase/supabase-js";
import {Profile} from "types/alias";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

type SpecReportType = {
    params : {
        __pupilId : string
        specId: number
    }
}
const SpecReport = ({params}: SpecReportType) => {

    const {__pupilId, specId} = params;
    
    const searchParams = useSearchParams();
    const __classid =  parseInt(searchParams && searchParams.get('classid') || "0");
    console.log("__classid", __classid, searchParams?.has("clientid"));
    // Display the key/value pairs
    for (const [key, value] of searchParams!.entries()) {
        console.log(`${key}, ${value}`);
    }

    const {supabase} = useSupabase();

    //const {profile, classes, pupilMarks} = useContext(UserContext);

    const [user, setUser] = useState<User | null>(null);

    const [currentClassId, setCurrentClassId] = useState(__classid || null);

    const [pupilId, setPupilId] = useState(__pupilId);

    const [classes, setClasses] = useState(null);
    const [allPupils, setAllPupils] = useState(null);
    const [pupilMarks, setPupilMarks] = useState(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    
    const getClassesForPupil = async (pupilId: string) => {

        const {data, error} = await supabase.from("ClassMembership")
                                            .select("Classes(*)")
                                            .eq("pupilId", pupilId);
                                            
        error && console.error(error);
        data && console.log(data);
        if (!data || data === null || data.length == 0){
            setClasses(null);
            return;
        }

        // @ts-ignore
        const shapedData = data.map((c) => ({id: c.Classes.id, tag: c.Classes.tag, title: c.Classes.title, specId: c.Classes.specId}));
        console.log("shapedData", shapedData);

        // @ts-ignore
        setClasses(shapedData);

        if (__classid) {
            setCurrentClassId(__classid)
        } else {
            //@ts-ignore
            console.log("Setting currentClassId to ", data[0].Classes.id);

            //@ts-ignore
            setCurrentClassId(data[0].Classes.id);
        }
    }
    
    const getAllClasses = async () => {
        const {data:classes, error} = await supabase.from("Classes").select()

        
        // console.log("Classes", classes);

        error && console.error(error);

        if (!classes)
            return;

        //@ts-ignore
        setClasses(classes.map(c => ({id: c.id, tag: c.tag, title: c.title, specId: c.specId})));

        if (currentClassId == null){
            setCurrentClassId(classes[0].id)
        }
        //setCurrentClassId(classes[0].id)
    }

    const getSpecId = (classId: number) => {
        if (!classes || !classId)  
            return null;

        // console.log("looking for", classId, " in ", classes);
        //console.log("classes", classes, classId)
        //@ts-ignore
        return classes.filter((c) => c.id == classId)[0].specId;

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


        if (!profile){
            return;
        }

        if (profile && profile.isAdmin) {
            getAllClasses();
        } else {
            getClassesForPupil(profile.id);
        }
        
        
    }, [profile, specId]);


    useEffect(()=> {

        if (!profile)
        {
            return;
        }

        if (profile.isAdmin) {
            getAllPupils(currentClassId!);
        } 

    }, [profile, classes, currentClassId]);

    return <>
        <h1>
            Spec Report for
        
            {profile &&  classes && 
                        //@ts-ignore
                        <Select className={styles.select} value={currentClassId!} onChange={(e) => {setCurrentClassId(parseInt(e.target.value!))}}>
                            {
                                //@ts-ignore
                                classes.map((ac, i) => <MenuItem value={ac.id} key={i}>{ac.title}</MenuItem>)}
                        </Select>
            }

            { profile && (
                (!profile?.isAdmin) && `${profile?.firstName} ${profile?.familyName}`)
            }

            {
                allPupils && 
                        <Select className={styles.select} value={pupilId} onChange={(e) => {setPupilId(e.target.value)}}>
                            {
                                //@ts-ignore
                                allPupils.map((p, i) => <MenuItem value={p.pupilId} key={i}>{p.firstName} {p.familyName}</MenuItem>)}
                        </Select>
            }
        </h1>
        <hr></hr>
        <div className={styles.display}>
            <div className={styles.progress}>
                {
                    <DisplaySpecProgress pupilId={pupilId} specId={getSpecId(currentClassId!)}/>
                }
            </div>
            
            <div className={styles.byMarks}>
                {
                    <DisplaySpecDataByMarks pupilId={pupilId} specId={getSpecId(currentClassId!)}/>
                }
            </div>
            
            
            <div className={styles.qPapers}>
                {
                    <DisplayPapersForPupil classId={currentClassId!} pupilId={pupilId} specId={getSpecId(currentClassId!)}/>
                }
            </div>
            <div className={styles.items}>
                {//@ts-ignore
                 <DisplaySpecDataByItem pupilId={pupilId} specId={getSpecId(currentClassId)} classId={currentClassId}/>
                }
            </div>
            
        </div>
    </>
}


export default SpecReport;






