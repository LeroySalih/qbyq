"use client"

import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import supabase from "app/utils/supabase/client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Paper } from "@mui/material";
import styles from "./daily-answers.module.css";

const DailyQuestions = () => {

    const [answers, setAnswers] = useState<{ correct: number, incorrect: number } | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const loadAnswers = async () => {
        const {data: {user}} = await supabase.auth.getUser();

        
        if (!user) {
            console.error("No user, returning")
            return;
        }

        
        const {data, error} = await supabase.from("dqAnswers").select("id, isCorrect")
            .eq("owner", user.id)
            .gt("created_at",DateTime.now().startOf('day').toISO());

        
        error && console.error(error);
        
        data && setAnswers(counter(data));
    }

    const loadUser = async () => {
        const {data: {user}} = await supabase.auth.getUser();
        
        setUser(user);
    }

    const counter = (answers: {id: string, isCorrect: boolean | null }[]) => {
        const result = answers.reduce(
            (prev : {correct: number, incorrect: number }, curr : {id: string, isCorrect: boolean | null} ) => {
            return curr.isCorrect ? Object.assign ({}, prev, {correct: prev.correct + 1}) :
                                    Object.assign ({}, prev, {incorrect: prev.incorrect + 1}) 
        }, {correct: 0, incorrect: 0});

        return result;
        
    }

    useEffect(()=> {

        loadUser();

        supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            
            if (!session) {
                setUser(null);
            }

            const {user} = session!;

            setUser(user!);

        });

        const channelB = supabase
        .channel('schema-db-changes_master')
        .on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'dqAnswers'
        },
        (payload) => {loadAnswers();}
        )
        .subscribe();

        return ()=> {
            channelB.unsubscribe();
        }

    }, []);

    useEffect(() => {
        if (!user){
            console.error("No user, returning from useEffect");
        }

        loadAnswers();
    }, [user]);

    return <> 
    
    <Paper className={styles.layout}>
         <div>
            {!answers && <div>Loading...</div>}
            {answers && answers.correct + answers.incorrect == 0 && <div>No questions answered today.</div>}
            {answers && answers.correct + answers.incorrect > 0 && <div>
                {answers.correct + answers.incorrect} questions answered today.
                {answers.correct} correct.
                {answers.incorrect} incorrect.

            </div>}

        </div>

    </Paper>
   
    </>
}

export default DailyQuestions;