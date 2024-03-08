"use client"

import Link from "next/link";
import supabase from "app/utils/supabase/client";
import styles from "./display-queue-item.module.css";

import { ticketWaiting, ticketInProgress,  ticketFailed, ticketComplete, ticketTechNotes, ticketRemove } from "./update-ticket";

import {Ticket,Profile} from "./types";
import { useState, useEffect } from "react";

const DisplayQueueItem = ({profile, ticket}: { profile: Profile, ticket: Ticket; }) => {

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


    return <div className={styles.queueItem}>
    <div>{id}</div>
    <div>{userid}</div>
    <div>{machine}</div>
    <div>{notes}</div>
    <div>{firstName} {familyName}</div>
    <div>{status}</div>
    <div>Completed at: {complete_date && complete_date}</div>
    <div>Created at: {created_at && created_at}</div>
    <div> 
        <a href="https://shiny-giggle-v6r5g9w9r43p6j7-3000.app.github.dev/api/handle-download/0d65c82d-e568-450c-a48a-1ca71151e80f/floorplan.jpeg" download={true}>file</a>
    </div>
    
    <div>
        <button onClick={()=> {handleDeleteTicket(id)}}>Remove</button>
    </div>
    <select disabled={isSaving} value={ticketStatus} onChange={(e)=>setTicketStatus(e.target.value)}>
        <option value="waiting">Waiting</option>
        <option value="in progress">In progress</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
    </select>
    
    {(profile.isAdmin || profile.isTech) && ticketStatus == "failed" && <input value={techNote} onChange={(e) => setTechNote(e.target.value)} onBlur={(e) => handleTechNotes(id, e.target.value)}></input>}
    
    <div>
        {isSaving && <div>Saving</div>}
    </div>

    </div>

}



export default DisplayQueueItem