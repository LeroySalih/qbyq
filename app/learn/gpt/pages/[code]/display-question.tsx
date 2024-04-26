"use client"

import {Paper, Grid, Button} from "@mui/material";
// import styles from "./page.module.css";

import {Question} from "./question-types";
import { useEffect, useState } from "react";
import supabase from "app/utils/supabase/client";
import {AuthChangeEvent, Session, User} from "@supabase/supabase-js"
import { QueryStatsOutlined } from "@mui/icons-material";
import DisplayAnswers from "./display-answers";

import styles from "./display-question.module.css"
import { DateTime } from "luxon";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const DisplayQuestion = ({code} : {code: string}) => {
  

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [question, setQuestion] = useState<Question | null>(null);
    const [answerId, setAnswerId] = useState<string | null>(null);

    const [user, setUser] = useState<User | null>(null);

    const [selected, setSelected] = useState<number | null>(null);
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [correctAnswerCount, setCorrectAnswerCount] = useState<number>(0);
    const [isLocked, setIsLocked] = useState<boolean>(false);


    const loadNextQuestion = async (code: string) => {

      setIsLoading(true);

      setSelected(null);
      setSelectedText(null);
      setAnswerId(null);

      if (!user) {
        return;
      }


      const {data: answerCount, error: answersError} = await supabase.from("dqAnswers")
                  .select("id, dqQuestions!inner(code)")
                  .eq("owner", user.id)
                  .eq("isCorrect", true)
                  .gt("created_at",DateTime.now().startOf('day').toISO())
                  .eq("dqQuestions.code", code);

      if (answersError){
        throw(answersError);
      }

      setCorrectAnswerCount(answerCount.length);

      // restrict the number of corretc answers a pupil can answer for a code.
      //if (answerCount.length > 9){
      //  setIsLocked(true);
      //}


      //const {data, error} = await supabase.from("dqQuestions").select("id, question_text, choices, correct_answer").eq("code", code).limit(1);
      const {data, error} = await supabase.rpc("dq_loadnextquestionbycode", {_code: code, _owner: user.id})
      
      error  && console.error(error);
      
      //@ts-ignore
      setQuestion(data[0]);      
    
      setIsLoading(false);
    }

    const loadUser = async () => {

      const {data, error} = await supabase.auth.getUser();
      error && console.error(error);

      setUser(data.user);
    }

    const saveResponse = async (index: number) => {

      if (!question)
        return;


      const {data, error} = await supabase.from("dqAnswers").insert({
        owner: user?.id || "", 
        questionId: question?.id,
        answer: JSON.stringify(question.choices[index]),
        isCorrect: question.choices[index] == question?.correct_answer
      }).select("id");

      error && console.error(error);
      
      setAnswerId(data ? data[0].id : null);

    }

    const handleAuthChanged = ( event: AuthChangeEvent, session: Session | null) => {

      if (session){
        const user = session.user;
        setUser(user);

        // refresh the current page in case it's a server side page.
        // router.refresh();

      } else {
        setUser(null);

        // no user (logged out), so redirect to home
        // router.push(`/`);
      }
    }

    const handleReportClicked = async () => {
      if (!answerId) return;

      const {data, error} = await supabase.from("dqAnswers").update({flag: true}).eq("id", answerId).select("id");

      error && console.error(error);

    }

    useEffect(()=>{
      loadUser();

      const {data: {subscription} } = supabase.auth.onAuthStateChange(handleAuthChanged);

      return ()=> {
        subscription.unsubscribe();
      }
    }, []);

    useEffect(()=> {
      
      if (user){
        loadNextQuestion(code);
      } else {
        setQuestion(null);
      }
      
    }, [user])

    useEffect(()=>{
      loadNextQuestion(code);

    }, [code]);


    const handleNextQuestion = () => {
        loadNextQuestion(code);
    }

    const handleClick = (index: number) => {
      
      // only update if not selected
      if (selected) {
        return;
      }


      saveResponse(index);
      setSelected(index);
    }

    const getAnsweredStyles = (i: number) => {
      if (i == selected) {
        return (selectedText == question?.correct_answer) ? styles.answered_correct : styles.answered_incorrect;
      }
    }

    const getHoverState = () => {
      return (selected == null) ? styles.choice : styles.selected;
    }

    

    useEffect(()=> {

      if (selected == null)
        return;

      setSelectedText(question?.choices[selected]);

    }, [selected])
  
    if (!user){
      return <div>Loading User Details</div>
    }

    if (isLocked){
      return <>
        <div style={{"display": "flex", "flexDirection": "row", "alignItems": "center", "margin": "2rem"}}>
        <div style={{"margin":"2rem;"}}>
          <LockOutlinedIcon fontSize="large"/>
        </div>
        <div>
          <h3>You have answered 10 correct answers in this video today.</h3>
          <h4>Why not try a different video?</h4>
        </div>
        </div>
      </>
    }

    return <div className={styles.questionContainer}>
        
        <Paper>
            
            {isLoading && <div>Loading...</div>}
            {!isLoading && <><div className={styles.questionInner}>
              <div className={styles.question_text}>
                {question && question.question_text}
              </div>
              
              <Grid container spacing={3} className={styles.choices}>
              {question && question.choices.map ((c: string, i: number) => <Grid key={i} item xs={12} md={6} lg={3}> 
                <div className={`${getHoverState()} ${getAnsweredStyles(i)}`} onClick={() => handleClick(i)}>
                  {c}
                </div>
                </Grid>)}
              </Grid>
              {question && <div className={styles.questionId}>question id:{question.id}</div>}
      
            </div>
            <div>
              {selected != null && <>
                <Button onClick={handleReportClicked}>Report</Button>
                <Button onClick={handleNextQuestion}>Next Question</Button>
                </>}
            </div>
            </>}
        </Paper>
    </div>

  }


  export default DisplayQuestion;