"use client"

import supabase from "app/utils/supabase/client";
import { useEffect, useState } from "react";

import styles from "./display-answers.module.css";
import { Paper } from "@mui/material";

type Answer = { id: string; created_at: string, isCorrect: boolean | null; }
type Answers = Answer[] | null;

const DisplayAnswers = () => {

    const [answers, setAnswers] = useState<Answers>(null);

    const loadAnswers = async () => {

        const {data, error} = await supabase.from ("dqAnswers")
                                    .select("id, created_at, isCorrect")
                                    .gt("created_at","2024-03-17 00:00:00")
                                    
                                    

        error && console.error(error);

        console.log("Answers", data);

        data && setAnswers(data);
    }

    useEffect (()=> {

        loadAnswers();
        
        const channelA = supabase
        .channel('schema-db-changes')
        .on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'dqAnswers'
        },
        (payload) => {console.log(payload); loadAnswers();}
        )
        .subscribe()

        return ()=> {
            channelA.unsubscribe();
        }
        
    }, [])

    return <Paper>
        <h1>Todays Answers</h1>
        <div className={styles.last10Answers}>
            <div>Last 10 answers</div>
            <div className={styles.container}>
            {
                answers && answers
                                .sort((a, b) => a.created_at > b.created_at ? 1 : -1)
                                .slice(-10)
                                .map((a,i) => <div className={a.isCorrect? styles.correct : styles.incorrect}></div>)
            }
            </div>
        </div>
    </Paper>
}


export default DisplayAnswers;