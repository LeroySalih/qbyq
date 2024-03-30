"use client";

import {useState, useEffect} from "react";
import supabase from "app/utils/supabase/client";
import { User } from "@supabase/supabase-js";

const QuestionSummary = ({path} : {path: string}) => {

    
    const [answers, setAnswers] = useState(null);
    const [user, setUser] = useState<User | null>(null);
    

  const loadSummary = async () => {
    if (!user)
    {
      console.error("No user, exiting")
      return;
    }
      

    
    //const {data, error} = await supabase.from ("QPAnswer").select().match({userId: user.id, path} );
    const {data, error} = await supabase.rpc("fn_qp_get_current_answers", {_userid: user.id, _path: path});

    error && console.error(error);

    //@ts-ignore
    setAnswers(data);
  }

  const loadUser = async () => {
    const {data: {user}} = await supabase.auth.getUser();
    setUser(user);
  }
    

    useEffect(() => {

      
        
       
    loadUser();
    }, []);


    useEffect(() => {
      
      const channel = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
    },
    (payload) => {loadSummary()}
  )
  .subscribe();

      loadSummary();
    }, [user])

    const progress = () => {
      if (!answers)
        return {max: 0, points: 0};

      //@ts-ignore
      return answers.reduce((prev, curr)=> { return {max: prev.max += curr._max_points, points: prev.points += curr._points }}, {max: 0, points: 0})
    }
    return <><div>{progress().max}, {progress().points} </div>Summary: <pre>{JSON.stringify(answers, null, 2)}</pre></>
}

export default QuestionSummary;