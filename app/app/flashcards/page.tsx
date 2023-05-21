"use client";


import styles from "./page.module.css";

import {useState, useEffect} from "react";


import DisplayQueues from "./display-queues";

import FlipCard, {FlipCardContainer} from './flip-card';

import { FCGetQueueReturn, FCGetQueuesReturn, FCQueue, FCQueueItem } from "types/alias";
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
        moveUpFn: (qi: QueueItem) => dayjs().add(1, 'day').subtract(1, 'minute').toDate()  
    },
    [1] : {
        id: 1,
        label: "This Week",
        filterFn: (qi:QueueItem) =>  dayjs().toDate() < dayjs(qi.dueDate).toDate() && dayjs(qi.dueDate).toDate() <= dayjs().add(7,'day').toDate(),
        moveUpFn: (qi: QueueItem) => dayjs().add(1, 'week').subtract(1, 'minute').toDate()  
    },
    [2] : {
        id: 2,
        label: "This Month",
        filterFn: (qi:QueueItem) =>  dayjs(qi.dueDate).toDate() > dayjs().add(7,'day').toDate(),
        moveUpFn: (qi: QueueItem) => dayjs().add(1, 'month').subtract(1, 'minute').toDate()    
    },
}

const moveUpQueue = (qi: FCQueueItem) : FCQueueItem => {
    const {currentQueue} = qi;
    //@ts-ignore
    return {...qi, ['dueDate']: _queues[qi.currentQueue].moveUpFn(qi), currentQueue: qi.currentQueue == 0 ? 1 : 2}
}

const resetToToday = (qi: FCQueueItem) : FCQueueItem => {
    return {...qi, ['dueDate']: dayjs().toDate().toString(), currentQueue: 0}
}


const FlashCardPage = () => {
    
    const [userId, setUserId] = useState<string>('0d65c82d-e568-450c-a48a-1ca71151e80f')
    
    //Holds a list of all possible queues for this user
    const [userQueues, setUserQueues] = useState<FCGetQueuesReturn | null>(null);

    //Holds the specItemId of the current queue
    const [currentUserQueue, setCurrentUserQueue] = useState(0);
    const [userQueue, setUserQueue] = useState<FCGetQueueReturn | null>(null);

    const [currentQueueType, setCurrentQueueType] = useState<QueueType>(0);
    const [state, setState] = useState<string>("front");
    const {supabase} = useSupabase();

    const handleToggle = () => {
        setState(prev => prev == 'front' ? 'back' : 'front')
    }

    const handleAnswer = async (choice: string) => {
        console.log("in handleAnswer", choice)
        if (!userQueue)
            return;

        // update queue history in db (FCUserQuestionHistory)
        const {data: historyData, error: historyError}= await supabase.from("FCUserQuestionHistory").insert({
            userid: userId,
            specItemId: currentUserQueue,
            questionId: userQueue[0].questionId,
            answer: choice,
            result: choice == userQueue[0].term
        });

        historyError && console.error(historyError);
        historyData && console.log(historyData);
        
        handleToggle();

    }

    const updateDb = async (qi: FCQueueItem)=>{

        console.log("Updating", qi.userId,qi.specItemId, qi.questionId );

        const {error} = await supabase
        .from ("FCUSerQueueEntries")
        .update({dueDate: qi.dueDate, currentQueue: qi.currentQueue
                })
        .match({
            "userId" : qi.userId,
            "specItemId": qi.specItemId,
            "questionId": qi.questionId
        })
        

        error && console.error("Update Error", error);
        //console.log("Update Date",data);
    }

    const handleNext = async (choice: string) => {
        // update the order of the queue in the data base and locally

        console.log("In Handle Next")
        if (!userQueue)
            return;

        
        console.log("Updating queue", userQueue);
        const tmpUserQueue = userQueue.map((q, i) => {
            if (i == 0){
                // update the first queue item in the database
                
                const qi = (choice === q.term) ? moveUpQueue(q): resetToToday(q);
                console.log("qi", choice == q.term, q, qi)
                updateDb(qi);
                return qi;

                return 
            }
            return q;
        })
        
        setState("front")
        
        // re-order the local queue
        //@ts-ignore
        setUserQueue(tmpUserQueue.sort((a,b) => a.dueDate < b.dueDate ? 1 : -1));
        
    }

    const loadUserQueues = async (userid: string) => {

        const {data, error} = await supabase
                                        .rpc("fn_fc_get_queues", {_userid: userid})
                                        
        
        error && console.error("Error", error);

        //@ts-ignore
        setUserQueues(data);

    }

    const loadUserQueue = async (userid: string, specItemId: number) => {
        const {data, error} = await supabase.rpc("fn_fc_get_queue", {_userid: userid, _specitemid: specItemId});

        error && console.error(error);
        console.log("read from db:", userid, specItemId, data);
        //@ts-ignore
        setUserQueue(data?.sort((a, b) => a.dueDate < b.dueDate ? 1 : -1));
    }

    const getCurrentQuestion = (userQueue: FCQueue) : FCQueueItem | null=> {
        if (!userQueue || userQueue.length == 0){
            return null;
        } 

        return userQueue.sort((a, b) => a.dueDate > b.dueDate ? 1 : -1)[0]
    }

    useEffect(()=> {
        // load a list of all queues for this user
        loadUserQueues(userId);
    }, [userId]);

    // list of user queues has changed, so update the current user queue
    useEffect(()=> {
        
        if (!userQueues )
            return;

        setCurrentUserQueue(userQueues[0].specItemId);
    }, [userQueues]);


    useEffect(()=> {
        loadUserQueue(userId, currentUserQueue)
    }, [currentUserQueue]);

    return <>
        
        <div className={styles.pageGrid}>

        {userQueues &&
            <div>
                {currentUserQueue! > 0 && <Select value={currentUserQueue} onChange={(e)=> {setCurrentUserQueue(e.target.value as number)}}>
                    {userQueues.map(
                        (uq, i) => 
                        <MenuItem key={i} value={uq.specItemId}>{uq.specItemTitle} ({uq.specItemTag})</MenuItem>
                    )
                    }
                </Select>
                }
            
                <Select value={currentQueueType} onChange={(e) => setCurrentQueueType(e.target.value as QueueType)}>
                    {Object.values(_queues).map((qi:QueueTypeFilter,i) => <MenuItem key={i} value={qi.id.toString()}>{qi.label}</MenuItem>)}
                </Select>
            </div>
        }
        <div></div>
        
        {userQueue &&  <FlipCardContainer> 
            <FlipCard 
                state={state} 
                question={userQueue[0]} 
                onClick={handleAnswer}
                onNext={handleNext}
            />
        </FlipCardContainer>
        }
        <div>        
            <div>
                {userQueue && <DisplayQueues queue={userQueue}/>}
            </div>
        </div>

        <div>
            {userqueue && <pre>Current Question: {JSON.stringify(getCurrentQuestion(userQueue), null, 2)}</pre>}
        </div>

        <div>
            <pre>current user queue: {JSON.stringify(userQueue, null, 2)}</pre>
        </div>
        
        </div>
    </>
}


export default FlashCardPage;