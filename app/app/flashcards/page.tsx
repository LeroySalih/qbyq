"use client";


import styles from "./page.module.css";

import {useState, useEffect} from "react";

import {RealtimePostgresChangesPayload} from '@supabase/supabase-js';

import DisplayQueueSummary from "./display-queue-summary";

import FlipCard, {FlipCardContainer} from './flip-card';

import { FCGetNextQuestionReturn, FCGetNextQuestionItem,  FCGetQueueReturn, FCGetQueueSummaryReturn, FCGetQueuesReturn, FCQueue, FCQueueItem } from "types/alias";
import {Questions, QueueItem, Queue, QueueType, QueueTypeFilter, QueueTypeFilters, QueueDescriptors} from './types'
import dayjs from "dayjs";

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useSupabase } from "components/context/supabase-context";


const _queues: QueueTypeFilters = {
    [0] : {
        id: 0,
        label: "Today",
        filterFn: (qi:QueueItem) => dayjs(qi.dueDate).toDate() < dayjs().toDate(),
        moveUpFn: (qi: QueueItem) => dayjs().add(1, 'day').subtract(1, 'minute').toISOString()  
    },
    [1] : {
        id: 1,
        label: "This Week",
        filterFn: (qi:QueueItem) =>  dayjs().toDate() < dayjs(qi.dueDate).toDate() && dayjs(qi.dueDate).toDate() <= dayjs().add(7,'day').toDate(),
        moveUpFn: (qi: QueueItem) => dayjs().add(1, 'week').subtract(1, 'minute').toISOString()  
    },
    [2] : {
        id: 2,
        label: "This Month",
        filterFn: (qi:QueueItem) =>  dayjs(qi.dueDate).toDate() > dayjs().add(7,'day').toDate(),
        moveUpFn: (qi: QueueItem) => dayjs().add(1, 'month').subtract(1, 'minute').toISOString()    
    },
}

const moveUpQueue = (qi: FCQueueItem) : FCQueueItem => {
    
    let newDueDate = qi.dueDate;
    let newQueue = qi.currentQueue;

    switch(qi.currentQueue) {
        case 0: newDueDate = dayjs().add(1, 'day').toISOString();  newQueue = 1; break;
        case 1: newDueDate = dayjs().add(1, 'week').toISOString(); newQueue = 2; break;
        case 2: newDueDate = dayjs().add(1, 'month').toISOString(); break;
    }

    //@ts-ignore
    return {...qi, ['dueDate']: newDueDate, currentQueue: newQueue}
}

const resetToToday = (qi: FCQueueItem) : FCQueueItem => {
    return {...qi, ['dueDate']: dayjs().toDate().toISOString(), currentQueue: 0}
}


const FlashCardPage = () => {
    
    const [userId, setUserId] = useState<string>('0d65c82d-e568-450c-a48a-1ca71151e80f')
    
    //Holds a list of all possible queues for this user
    const [userQueues, setUserQueues] = useState<FCGetQueuesReturn | null>(null);
    const [userQuestion, setUserQuestion] = useState<FCGetNextQuestionItem | null>(null);

    //Holds the specItemId of the current queue
    const [currentUserQueue, setCurrentUserQueue] = useState(0);
    //const [userQueue, setUserQueue] = useState<FCGetQueueReturn | null>(null);

    const [userQueueSummary, setUserQueueSummary] = useState<FCGetQueueSummaryReturn | null>(null);
    
    //const [currentQueueType, setCurrentQueueType] = useState<QueueType>(0);
    const [state, setState] = useState<string>("front");
    const {supabase} = useSupabase();

    const handleToggle = () => {
        setState(prev => prev == 'front' ? 'back' : 'front')
    }

    const handleAnswer = async (choice: string) => {
        console.log("in handleAnswer", choice)
        
        if (!userQuestion)
            return;

        // update queue history in db (FCUserQuestionHistory)
        const {data: historyData, error: historyError}= await supabase.from("FCUserQuestionHistory").insert({
            userid: userId,
            specItemId: currentUserQueue,
            questionId: userQuestion.questionId,
            answer: choice,
            result: choice == userQuestion.term
        });

        historyError && console.error(historyError);
        historyData && console.log(historyData);
        
        handleToggle();

    }

    const updateDb = async (qi: FCQueueItem)=>{

        return new Promise(async (res, rej) => {

            console.log("Updating DB with", qi );

            const {error} = await supabase
                .from ("FCUSerQueueEntries")
                .update({dueDate: qi.dueDate, currentQueue: qi.currentQueue
                        })
                .match({
                    "userId" : qi.userId,
                    "specItemId": qi.specItemId,
                    "questionId": qi.questionId
                })
                

                error && console.error("Update Error", error)
                error && rej(error);
                res(true);
        
        })
        
    }

    const handleNext = async (choice: string) => {
        // update the order of the queue in the data base and locally

        console.log("In Handle Next")
        if (!userQuestion)
            return;

        
        const qi = (choice === userQuestion.term) ? moveUpQueue(userQuestion): resetToToday(userQuestion);
        
        console.log("Question Editied to", qi)
        
        // ensure that updateDb is complete before proceeding
        await updateDb(qi);
        
        loadNextQuestion(userId, currentUserQueue);
        loadUserQueueSummary(userId, currentUserQueue);

        // notify channel that user has submitted a question
        const channel = supabase.channel('22-10BS1', {
            config: {
              broadcast: {
                self: true,
              },
            },
          });

        console.log("Channel", channel);

        channel
        .on('broadcast', { event: 'supa' }, (payload) => console.log(payload))
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                channel.send({
                type: 'broadcast',
                event: 'QUESTION_ANSWERED',
                payload: { org: {msg: "User Question Submitted"} },
                })
            }
        })
               
    }

    const loadUserQueues = async (userid: string) => {

        const {data, error} = await supabase
                                        .rpc("fn_fc_get_queues", {_userid: userid})
                                        
        
        error && console.error("Error", error);

        //@ts-ignore
        setUserQueues(data);

    }

    /*
    const loadUserQueue = async (userid: string, specItemId: number) => {
        const {data, error} = await supabase.rpc("fn_fc_get_queue", {_userid: userid, _specitemid: specItemId});

        error && console.error(error);
        console.log("read from db:", userid, specItemId, data);
        //@ts-ignore
        setUserQueue(data?.sort((a, b) => a.dueDate < b.dueDate ? 1 : -1));
    }
    */

    const loadNextQuestion = async (_userid: string, _specitemid: number) => {
        const {data, error} = await supabase.rpc("fn_fc_get_next_question", {_userid, _specitemid});

        error && console.error(error);
        console.log("Next Question", data)

        // @ts-ignore
        setUserQuestion(data && data.length > 0 ? data[0] : null);
        setState("front")

    }
    /*

    const getCurrentQuestion = (userQueue: FCQueue) : FCQueueItem | null=> {
        if (!userQueue || userQueue.length == 0){
            return null;
        } 

        return userQueue.sort((a, b) => a.dueDate > b.dueDate ? 1 : -1)[0]
    }
    */

    const loadUserQueueSummary = async (_userid: string, _specitemid: number) => {

        const {data, error} = await supabase.rpc("fn_fc_get_queue_summary", {_userid, _specitemid});

        error && console.error(error);

        // @ts-ignore
        setUserQueueSummary(data);
    }

    const checkQuestionUpdate = (payload : RealtimePostgresChangesPayload<{ [key: string]: any; }>)  => {
        
        //console.log("Payload", payload.eventType === "UPDATE", payload.new.id, payload.new.id === userQuestion?.questionId);

        if (payload.eventType === "UPDATE" && payload.new.id === userQuestion?.questionId){

            console.log("Updating current question");

            const updatedQuestion = Object.assign({}, userQuestion, {term: payload.new.term, text: payload.new.text});

            setUserQuestion(updatedQuestion);

        }
        //if (payload.new.)

    }

    useEffect(()=> {

        // subscribe to changes in FCQuestion table in case a question changes
        // while its being read. 
        const questionUpdateChannel = supabase.channel('schema-db-changes').on(
            'postgres_changes',
                {
                event: '*',
                schema: 'public',
                },
                checkQuestionUpdate
                ).subscribe();


        return () => {
            questionUpdateChannel.unsubscribe();
        }

    }, [])

    useEffect(()=> {
        // load a list of all queues for this user
        loadUserQueues(userId);
        
    }, [userId]);

    // list of user queues has changed, so update the current user queue
    useEffect(()=> {
        
        if (!userQueues || userQueues.length == 0)
            return;

        setCurrentUserQueue(userQueues[0].specItemId);


    }, [userQueues]);
    

    useEffect(()=> {
        // loadUserQueue(userId, currentUserQueue);
        loadNextQuestion(userId, currentUserQueue);
        loadUserQueueSummary(userId, currentUserQueue);
    }, [currentUserQueue]);

    return <>
        
        <div className={styles.pageGrid}>

        {userQueues &&
            <div className={styles.pageGridHeader}>
                {currentUserQueue! > 0 && 
                <Select value={currentUserQueue} onChange={(e)=> {setCurrentUserQueue(e.target.value as number)}}>
                    {userQueues.map(
                        (uq, i) => 
                        <MenuItem key={i} value={uq.specItemId}>{uq.specItemTitle} ({uq.specItemTag})</MenuItem>
                    )
                    }
                </Select>
                }
            
                {
                    userQueueSummary && <DisplayQueueSummary queueSummary={userQueueSummary}/>
                }
            </div>
        }
        <div></div>

        {
            !userQuestion && <div className={styles.noMoreQuestions}><h1>No more questions!</h1></div>
        }
        
        {userQuestion &&  <FlipCardContainer> 
            <FlipCard 
                state={state} 
                question={userQuestion} 
                onClick={handleAnswer}
                onNext={handleNext}
            />
        </FlipCardContainer>
        }
        <div>        
            <div>
                
            </div>
        </div>

        
        </div>
    </>
}


export default FlashCardPage;