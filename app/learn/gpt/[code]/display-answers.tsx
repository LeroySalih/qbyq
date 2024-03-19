"use client"

import supabase from "app/utils/supabase/client";
import { useEffect, useState } from "react";

import styles from "./display-answers.module.css";
import { Paper, Button } from "@mui/material";
import { DateTime } from "luxon";

type Answer = { id: string; created_at: string, isCorrect: boolean | null; }
type Answers = Answer[] | null;


// todo - add a report button
// todo - add a class report to see what pupils have completed between 2 dates

const DisplayAnswers = ({userId, code}: {userId: string | undefined, code: string}) => {

    const [answers, setAnswers] = useState<Answers>(null);
    const [correctScore, setCorrectScore] = useState<number | null>(null);

    const loadAnswers = async () => {

        const {data, error} = await supabase.from ("dq_vw_answers")
                                    .select("id, created_at, isCorrect, code")
                                    .eq("code", code)
                                    .gt("created_at",DateTime.now().startOf('day').toISO())
                                                                        
                                    

        error && console.error(error);

        console.log("Answers", data);

        const correctCount = data?.filter((a) => a.isCorrect).length || 0;
        
        setCorrectScore(data && data.length > 0 ? correctCount / data?.length: 0)

        // @ts-ignore
        data && setAnswers(data);
    }

    const handleResetAnswers = async () =>{

        
        const {error} = await supabase.from("dqAnswers").delete()
                                .eq("owner", userId!)
                                .gt("created_at",DateTime.now().startOf('day').toISO());

        error && console.error(error);

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
        
    }, []);

    return <Paper className={styles.answerContainer}>
        <h1>Todays Answers</h1>
        <div className={styles.dashboard}>
        <div className={styles.answersComponent}>
            <div className={styles.last10AnswerTitle}>Last 10 answers today.</div>
            
            <div className={styles.container}>
            {
                answers && answers
                                .sort((a, b) => a.created_at > b.created_at ? 1 : -1)
                                .slice(-10)
                                .map((a,i) => <div key={i} className={a.isCorrect? styles.correct : styles.incorrect}></div>)
            }
            </div>
        </div>
        <div  className={styles.answersComponent}>
            {answers?.length} questions answered.
        </div>
        <div  className={styles.answersComponent}>
            Correct Rate: <div>{((correctScore || 0) * 100)?.toFixed()}%</div>
        </div>
        <div>
            <Button onClick={handleResetAnswers} variant="contained">Reset</Button>
        </div>
        </div>
    </Paper>
}


export default DisplayAnswers;