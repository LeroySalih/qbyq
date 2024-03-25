"use client"

import DisplayQueueItem from "./display-queue-item";
import {Grid} from "@mui/material";
import {Ticket, Tickets, Profile} from "./types"
import Switch from '@mui/material/Switch';
import {useEffect, useState} from "react";

const label = { inputProps: { 'aria-label': 'Hide Completed' } };

const DisplayQueueItems = ({tickets, profile} : {tickets: Tickets, profile: Profile}) => {

    const [hideCompleted , setHideCompleted] = useState<boolean | null>(true);
    const [filteredItems, setFilteredItems] = useState<Tickets>(tickets);
    
    const handleChangeHideCompelted = (event:  React.ChangeEvent<HTMLInputElement>) => {
        setHideCompleted(event.target.checked);
    }

    useEffect(()=>{
        //setFilteredItems(tickets && tickets.filter(t => !hideCompleted || (hideCompleted && t.status != "completed") ))
        setHideCompleted(true)
    }, [])

    useEffect(() => {
        setFilteredItems(tickets && tickets.filter(t =>  (hideCompleted && t.status != "completed") || !hideCompleted ))
    }, [hideCompleted]);

    return <>
        <div>Hide Completed <Switch {...label} value={hideCompleted} onChange={handleChangeHideCompelted}/> <pre>{hideCompleted ? "Hiding" : "Showing"}</pre></div>
        { filteredItems && filteredItems.map((ticket: Ticket, i: number) => (<Grid key={i}>
            <DisplayQueueItem  profile={profile} ticket={ticket}/>
        </Grid>)
        )}
        </>
}


export default DisplayQueueItems;