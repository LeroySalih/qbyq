"use client"


import {useState, useEffect} from 'react';
import styles from "./display-papers-for-pupil.module.css"
import Card from "components/card";
import supabase from "app/utils/supabase/client";
import { DateTime } from 'luxon';

import Link from 'next/link';

const Comp = ({classId, pupilId, specId} : {classId : number, pupilId: string, specId: string}) => {

    const [displayMode, setDisplayMode] = useState<string>();
    //const [papers, setPapers] = useState(null);
    const [duePapers, setDuePapers] = useState(null);
    const [completedPapers, setCompletedPapers] = useState(null);

    

    const getPapers = async (pupilid : string) => {
        return await supabase.rpc("fn_get_paper_data_for_pupil", {pupilid})
    } 

    type GetPapersResponse = Awaited<ReturnType<typeof getPapers>>
    type GetPapersResponseData = GetPapersResponse['data']
    type GetPapersResponseError = GetPapersResponse['error']
    
    const loadPapers = async (pupilid : string) => {

        const resp: GetPapersResponse = await getPapers(pupilId); 

        const {data, error} = resp;
        error && // console.log(error);
        

        // Completed Papers are papers where pMarks are greater than 0.
        // @ts-ignore
        setCompletedPapers(data?.filter(p => (p.specId === specId) && (p.pMarks > 0))
            //@ts-ignore
            .sort((a, b)=> a.completeBy < b.completeBy ? 1 : -1)
            .map((p:any) => ({
            //@ts-ignore
            paperId: p.paperId, title: `${p.year}-${p.month}-${p.paper}`, pMarks: p.pMarks, qMarks: p.qMarks, availableFrom: p.availableFrom, completeBy: p.completeBy, markBy: p.markBy
            })
            ));

        //@ts-ignore
        setDuePapers(data?.filter(p => (p.specId === specId) && (!p.pMarks))
            //@ts-ignore
            .sort((a, b)=> a.completeBy > b.completeBy ? 1 : -1)
            .map(p => ({
            //@ts-ignore
            paperId: p.paperId, title: `${p.year}-${p.month}-${p.paper}`, pMarks: p.pMarks, qMarks: p.qMarks, availableFrom: p.availableFrom, completeBy: p.completeBy, markBy: p.markBy
            })
            )
            //@ts-ignore
            .filter((a) => a.availableFrom < DateTime?.now()?.toISODate())
        );
    
    }

    useEffect(()=> {
        setDisplayMode('due');
        
    }, []);


    useEffect(()=> {
        loadPapers(pupilId);
    }, [pupilId, specId]);


    // classId
    // pupilId
    // specId
    return <Card>
        <div className={styles.headerPane}>
            <h1>Papers 1</h1>
            <div>
                <span className={`${displayMode == 'due' ? styles.active : styles.inactive}`} onClick={()=> displayMode == 'completed' && setDisplayMode('due')}>Due</span>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <span className={`${displayMode == 'completed' ? styles.active : styles.inactive}`} onClick={()=> displayMode == 'due' && setDisplayMode('completed')}>Completed</span>
            </div>

            
        </div>
        {displayMode == 'due' && (<div>
        <div>Due</div>

        <div className={styles.dueDisplay}>
            <div>Paper</div>
            <div>Available</div>
            <div>Complete </div>
            <div>Mark By</div>
            
            {//@ts-ignore
            duePapers && duePapers.map((dp, i) => [
                <div key={`l${i}`} className={styles.duePaper}>
                <Link href={`/app/paper-form/${dp.paperId}/${classId}`}>{dp.title}</Link>,
                </div>,
                <div key={`c${i}`} className={styles.duePaper}>{DateTime.fromISO(dp.availableFrom).toFormat("yyyy-MM-dd")}</div>,
                <div key={`c${i}`} className={styles.duePaper}>{DateTime.fromISO(dp.completeBy).toFormat("yyyy-MM-dd")}</div>,
                <div key={`m${i}`} className={styles.duePaper}>{DateTime.fromISO(dp.markBy).toFormat("yyyy-MM-dd")}</div>,
            
            ])}
        </div>

        

       
        </div>  )      
        }

        {displayMode == 'completed' && <><div>Completed</div>

        <div className={styles.completedDisplay}>
            <div>Paper</div>
            <div>Available From</div>
            <div>Completed </div>
            <div>Marks</div>
            <div>%</div>
            
            {//@ts-ignore
            completedPapers && completedPapers.map((dp, i) => [
                <div key={`l${i}`} className={styles.duePaper}>
                    <Link href={`/app/paper-form/${dp.paperId}/${classId}`}>{dp.title}</Link>,
                </div>,
                <div key={`c${i}`} className={styles.duePaper}>{DateTime.fromISO(dp.availableFrom).toFormat("yyyy-MM-dd")}</div>,
                <div key={`c${i}`} className={styles.duePaper}>{DateTime.fromISO(dp.completeBy).toFormat("yyyy-MM-dd")}</div>,
                <div key={`m${i}`} className={styles.duePaper}>{dp.pMarks}</div>,
                <div key={`m${i}`} className={styles.duePaper}>{(dp.pMarks / dp.qMarks * 100).toFixed(0)}%</div>,
            
            ])}
        </div>
        </>}
        
        </Card>
}


export default Comp;