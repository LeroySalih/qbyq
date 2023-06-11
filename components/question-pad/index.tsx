"use client";

import { ReactElement } from "react";
import { useState, useEffect} from "react";
import { useSupabase } from "components/context/supabase-context";
import { User} from "@supabase/supabase-js";

export const MCQ = ({content, answers}: 
    {
        content:ReactElement, 
        answers: {id: number, text: string, isCorrect: boolean }[]
    }) => {    

    const [user, setUser] = useState<User | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [answer, setAnswer] = useState<string | null>(null);
    const {supabase} = useSupabase();

    useEffect(()=> {
        
        const loadUser = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            setUser(user);
        }

        loadUser();

    }, [])

    const handleUpdateAnswer = async (answer: string, isCorrect: boolean) => {

        setAnswer(answer);
        setIsCorrect(isCorrect);
    } 

    if (!user)
        return <></>

    return <><div>{content}</div>
        <ul>{
            answers.map((a, i) => <li key={i}><input type="radio" name="answers" onChange={()=> handleUpdateAnswer(a.text, a.isCorrect)}/>{a.text}</li>)
            }
        </ul>
        
        <pre>{JSON.stringify(isCorrect, null, 2)}</pre>
        <pre>{JSON.stringify(answer, null, 2)}</pre>
        <pre>{JSON.stringify(user.id, null, 2)}</pre>
        
        </>
}
