"use client"

import Link from "next/link";
import supabase from "app/utils/supabase/client";
import styles from "./display-queue-item.module.css";

import { ticketWaiting, ticketInProgress,  ticketFailed, ticketComplete, ticketTechNotes, ticketRemove } from "./update-ticket";

import {Ticket,Profile} from "./types";
import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { DateTime } from "luxon";

const DisplayQueueItem = ({profile, ticket}: { profile: Profile, ticket: Ticket }) => {

    const {id, userid, publicUrl, filePath, machine, notes, firstName, familyName, complete_date, created_at, status, isAdmin, isTech, tech_notes} = ticket;

    const [ticketStatus, setTicketStatus] = useState<string>(status);
    const [techNote, setTechNote] = useState<string>(tech_notes);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    
   

    const handleTechNotes = async(id: number, text: string) => {
        setIsSaving(true);
        await ticketTechNotes(id, text)
        setIsSaving(false);
    }

    const handleStatusChange = async (s: string) => {
        setIsSaving(true);

        switch (s) {
            case 'waiting' : await ticketWaiting(id); break;
            case 'in progress' : await ticketInProgress(id); break;
            case 'completed' : await ticketComplete(id); break;
            case 'waiting' : await ticketWaiting(id); break;
            case 'failed' : await ticketFailed(id); break;

            default: console.error("Unknown Status", s);

        }

        setIsSaving(false);
    }


    useEffect(()=> {
        handleStatusChange(ticketStatus);
    }, [ticketStatus])

    const handleDeleteTicket = async (id : number) =>  {
        setIsSaving(true);
        await ticketRemove(id);
        setIsSaving(false);
    }

    const getStatusClassName = (status: string) => {
        switch(status) {
            case 'in progress' : return styles.inProgress;
            case 'waiting' : return styles.waiting;
            case 'completed' : return styles.completed;
            case 'failed' : return styles.failed;
        }
    }

    return <div className={ styles.queueItem}>
    
    <Grid container>
       <Grid item xs={12} md={4}>{machine}</Grid> 
       <Grid item xs={12} md={4}>{firstName} {familyName}</Grid>
       <Grid item xs={12} md={4}><div className={`${styles.statusLabel} ${getStatusClassName(status)}`}>{status}</div></Grid>
       <Grid item xs={12} md={6}>{notes}</Grid>
       <Grid item xs={12} md={6}>{tech_notes}</Grid>
       <Grid item xs={12} md={4}>
        <a href={`/api/handle-download/${filePath}`} download={true}>file</a>
        
       </Grid>
       <Grid item xs={1} md={4}>
        <select disabled={isSaving} value={ticketStatus} onChange={(e)=>setTicketStatus(e.target.value)}>
            <option value="waiting">Waiting</option>
            <option value="in progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
        </select>
    
        {(profile.isAdmin || profile.isTech) && ticketStatus == "failed" && <input value={techNote} onChange={(e) => setTechNote(e.target.value)} onBlur={(e) => handleTechNotes(id, e.target.value)}></input>}
    
       </Grid>
       <Grid item xs={12} md={6}>
        <div className={styles.displayTime}>Created at {created_at && DateTime.fromISO(created_at,{zone: 'utc+3'}).toFormat("yyyy-MM-dd HH:MM")}</div>
       </Grid>

       <Grid item xs={12} md={6}>
       <div className={styles.displayTime}>Completed at: {complete_date && DateTime.fromISO(created_at,{zone: 'utc+3'}).toFormat("yyyy-MM-dd hh:mm")}</div>
       </Grid>
    
    </Grid>
    
    
    
    
    
    
    
    <div> 
        
    </div>
    
    <div>
        
    </div>
    
    <div>
        {isSaving && <div>Saving</div>}
    </div>

    </div>

}



export default DisplayQueueItem