"use client";

import { ReactElement } from "react";
import { useState, useEffect} from "react";
import supabase from "app/utils/supabase/client";
import { User} from "@supabase/supabase-js";

export const MCQ = ({path, id, content, answers, showLastAnswer, showCorrectAnswer}: 
    {
        path: string,
        id: string, 
        content:ReactElement, 
        answers: {id: number, text: string, isCorrect: boolean }[],
        showLastAnswer: boolean,
        showCorrectAnswer: boolean
    }) => {    

    const [user, setUser] = useState<User | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [answer, setAnswer] = useState<string | null>(null);
    const [lastAnswer, setLastAnswer] = useState< string | null>(null);
    

    useEffect(()=> {
        
        const loadUser = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            setUser(user);
        }

        

        loadUser();
        
    }, []);

    useEffect( ()=> {
        const loadLastUser = async ()=> {
            if (!user)
                return;

            const {data, error} = await supabase.from("QPAnswer").select().match({
                userId: user?.id,
                questionId: `${path}/${id}`
            })
            .order("created_at")
            .limit(1)
            .maybeSingle();

            error && console.error(error);
            

            if (!data){
                // first time this user has visited this question, so set it to the db as null
                const {data, error} = await supabase.from("QPAnswer").insert(
                {userId:user?.id, questionId: `${path}/${id}`, path, isCorrect: false, answer: '', max_points: 1, points: 0});
            }


            

            setLastAnswer(data?.answer || null);
        }

        loadLastUser();
    }
        , [user])

    

    const handleUpdateAnswer = async (answer: string, isCorrect: boolean) => {

        if (!user)
            return;

        const {data, error} = await supabase.from("QPAnswer").insert(
            {userId:user?.id, questionId: `${path}/${id}`, path, isCorrect, answer, max_points: 1, points: isCorrect ? 1 : 0});

        error && console.error(error);

        setAnswer(answer);
        setIsCorrect(isCorrect);
  
    } 

    if (!user)
        return <></>

    return <>
        <div>{content}</div>
            <ul>{
                answers.map((a, i) => <li key={i}>
                    <input type="radio" name="answers" onChange={()=> handleUpdateAnswer(a.text, a.isCorrect)}/>
                    { a.text}
                    {(showLastAnswer && lastAnswer === a.text) && <span style={{marginLeft: "2rem"}}>&lt;= Last Answer</span> }
                    <span style={{marginLeft: "2rem"}}>{showCorrectAnswer && a.isCorrect && "✅"}</span>
                    </li>
                )
                }
            </ul>
            
            <pre>{JSON.stringify(isCorrect, null, 2)}</pre>
            <pre>{JSON.stringify(answer, null, 2)}</pre>
            <pre>{JSON.stringify(user.id, null, 2)}</pre>
            <pre>{JSON.stringify(lastAnswer, null, 2)}</pre>
        </>
}
