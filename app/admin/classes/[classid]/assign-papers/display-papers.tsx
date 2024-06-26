"use client";
import {useState, useEffect, useTransition} from "react";
import styles from './page.module.css';


import { DateTime } from "luxon";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRouter } from "next/navigation";
import updateData from "./class-papers-utils";

const DisplayPapers = ({classTag, papers} : {classTag: string, papers : {paperId: string, year: string, month: string, paper: string, availablefrom: string, completeby: string, markby: string}[]}) => {
    
    const router = useRouter();

    let [isPending, startTransition] = useTransition();

    const handleDateChange = (classTag: string, paperId: string, field: string, dt: DateTime | null) => {

        startTransition(()=> {

            //@ts-ignore
            updateData(classTag, paperId, {[field]: dt} );
        })
            
        
    }

    const handleAvailableChange = (classTag: string, paperId: string, availablefrom: DateTime | null) => {

        handleDateChange(classTag, paperId, "availableFrom", availablefrom );
            
        router.refresh();
    }

    const handleCompleteChange = (classTag: string, paperId: string, completeby: DateTime | null) => {

        handleDateChange(classTag, paperId, "completeBy", completeby );
            
        router.refresh();
    }

    const handleMarkChange = (classTag: string, paperId: string, mark: DateTime | null) => {

        handleDateChange(classTag, paperId, "markBy", mark );
            
        router.refresh();
    }

    

    const handleUnassign = (paperId : string, classTag: string) => {

        startTransition(()=> {
            // @ts-ignore
            updateData(classTag, paperId, {"completeBy": null, "availableFrom": null, "markBy": null} );
        });

        router.refresh();
        
    }
    
    useEffect(() => {
        if(isPending) return;
        
        // THIS CODE WILL RUN AFTER THE SERVER ACTION
        
    }, [isPending]);

    if (isPending) {
        return <div>Loading</div>
    }

    return <div>
        <div>{classTag}</div>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
        
        <div className={styles.papersDisplay}>
            <div>id</div>
            <div>year</div>
            <div>month</div>
            <div>paper</div>
            <div>available from</div>
            <div>complete by</div>
            <div>mark by</div>
            <div>&nbsp;</div>

            {
                papers.map((p, i) => [
                    <div key={`$id${i}`}>{p.paperId}</div>,
                    <div key={`$year${i}`}>{p.year}</div>,
                    <div key={`$month${i}`}>{p.month}</div>,
                    <div key={`$paper${i}`}>{p.paper}</div>,
                    <div key={`$available${i}`}>
                        { <DatePicker value={DateTime.fromISO(p.availablefrom)} onChange={(value)=> handleAvailableChange(classTag, p.paperId, value)}/> }
                    </div>,
                    <div key={`$completeBy${i}`}>
                        { // DateTime.fromISO(p.completeby).toISODate()
                        }
                        { <DatePicker value={DateTime.fromISO(p.completeby)} onChange={(value)=> handleCompleteChange(classTag, p.paperId, value)}/> }
                    </div>,
                    <div key={`$markBy${i}`}>
                        { // DateTime.fromISO(p.markby).toISODate()
                        }
                        { <DatePicker value={DateTime.fromISO(p.markby)} onChange={(value)=> handleMarkChange(classTag, p.paperId, value)}/> }
                    </div>,
                    <div key={`null_${i}`}><button onClick={() => handleUnassign(p.paperId, classTag)}>Unassign</button></div>
                ])
            }

        </div>
        </LocalizationProvider>
    </div>
}


export default DisplayPapers;