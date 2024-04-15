"use client"

import DisplayQueueItem from "./display-queue-item";
import {Grid} from "@mui/material";
import {Ticket, Tickets, Profile} from "./types"
import Switch from '@mui/material/Switch';
import {useEffect, useState} from "react";
import styles from "./layout.module.css";

const label = { inputProps: { 'aria-label': 'Hide Completed' } };

const DisplayQueueItems = ({tickets, profile} : {tickets: Tickets, profile: Profile}) => {

    const [hideCompleted , setHideCompleted] = useState<boolean | null>(true);
    const [sortAscending, setSortAscending] = useState<boolean | null>(true);

    const [filteredItems, setFilteredItems] = useState<Tickets>(tickets);
    
    const handleChangeHideCompelted = (event:  React.ChangeEvent<HTMLInputElement>) => {
        setHideCompleted(event.target.checked);
    }

    const handleChangeSortAscending = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSortAscending(event.target.checked);
    }

    useEffect(()=>{
        //setFilteredItems(tickets && tickets.filter(t => !hideCompleted || (hideCompleted && t.status != "completed") ))
        setHideCompleted(true)
    }, [])

    useEffect(() => {
        setFilteredItems(tickets && tickets.filter(t =>  (hideCompleted && t.status != "completed") || !hideCompleted ))
    }, [hideCompleted]);

    const sort = (a:Ticket, b:Ticket) => {

        if (sortAscending){
            return a.created_at > b.created_at ? 1 : -1;
        } else {
            return a.created_at < b.created_at ? 1 : -1;
        }
    }

    return <>
        <div className={styles.sortPanel}>
            {/*
            <div>Hide Completed <Switch {...label} checked={hideCompleted || false} onChange={handleChangeHideCompelted}/> <pre>{hideCompleted ? "Hiding" : "Showing"}</pre>
            </div>
            */}
            <div>Sort Ascending <Switch {...label} checked={sortAscending || false} onChange={handleChangeSortAscending}/> <pre>{sortAscending ? "Ascending" : "Descending"}</pre>
            </div>
        </div>
        { filteredItems && filteredItems
                                .sort(sort)
                                //.filter((t: Ticket) => t.machine == "Test")
                                .map((ticket: Ticket, i: number) => (<Grid key={i}>
            <DisplayQueueItem  profile={profile} ticket={ticket}/>
        </Grid>)
        )}
        </>
}


export default DisplayQueueItems;