
"use client";

import {useState, useEffect} from 'react';
import { useParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import supabase from "app/utils/supabase/client";
import { Database } from 'types/supabase';
import styles from "./display-resources.module.css";
import { DateTime } from 'luxon';

const DisplayResources = () => {

    

    const params = useParams();
    const [user, setUser] = useState<User>();
    const {classId, paperId} = params as {classId: string, paperId: string};

    const [paper, setPaper] = useState();
    const [qPaperUrl, setQPaperUrl] = useState(null);
    const [aPaperUrl, setAPaperUrl] = useState(null);

    
    console.log("In Display Resources", classId, paperId);
    
    const loadUser = async () => {
        const {data: {user}, error} = await supabase.auth.getUser();

        error && console.error(error);

        //@ts-ignore
        setUser(user);
    }

    const loadResourcesForUser= async (user: User) => {

        const {data, error} = await supabase.from("ClassPapers")
                                            .select("paperId, completeBy, markBy, availableFrom, Papers(qPaperLabel, aPaperLabel)")
                                            .match({paperId, classId});

        error && console.error(error);
        console.log("Data", data)
        //@ts-ignore
        setPaper(data[0]);

    }

    const loadResourceUrl = async (paperId: string, label: string, setFn: any) => {

        const fileName = `${paperId}/${label}`;

        const {data, error} = await supabase.storage
                                .from('exam-papers')
                                .createSignedUrl(fileName, 3600);

        error && console.error(error);
        
        data && setFn(data.signedUrl);
    }

    useEffect(()=> {
        loadUser();
    }, [])

    useEffect(()=> {
        if (!user)
            return;

        loadResourcesForUser(user);
    }, [user]);


    useEffect(()=> {
        if (!paper){
            console.log("No paper, returning")
            return;
        }
            

        //@ts-ignore
        const {qPaperLabel, aPaperLabel} = paper?.Papers;

        console.log("Paper Label",qPaperLabel );

        if (qPaperLabel) {
            loadResourceUrl(paperId, qPaperLabel, setQPaperUrl);
        }

        if (aPaperLabel) {
            loadResourceUrl(paperId, aPaperLabel, setAPaperUrl);
        }

    }, [paper])
    
    return <>
            <div className={styles.container}>
                <div className={styles.item}>{
                    // display url to Paper 
                    //@ts-ignore
                    DateTime.fromISO(paper?.availableFrom) <= DateTime.now() && qPaperUrl && <a  target="new" href={qPaperUrl}>{paper?.Papers?.qPaperLabel}</a>
                }
                </div>
               
                <div className={styles.item}>
                {
                    //@ts-ignore
                    DateTime.fromISO(paper?.completeBy) <= DateTime.now() && aPaperUrl && <a target="new" href={aPaperUrl}>{paper?.Papers?.aPaperLabel}</a>
                }
                </div>
                </div>
                
           </>
}


export default DisplayResources;
