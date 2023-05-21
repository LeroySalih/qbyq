"use client";


import styles from "./page.module.css";

import {useState, useEffect, MouseEvent} from "react";

import Button from '@mui/material/Button';

import DisplayQueues from "./display-queues";
import DisplayQuestion from "./display-question";
import FlipCard, {FlipCardContainer} from './flip-card';

import { FCGetQueueReturn, FCGetQueuesReturn, FCQueueItem } from "types/alias";
import {Question, Questions, QueueItem, Queue, QueueType, QueueTypeFilter, QueueTypeFilters, QueueDescriptor, QueueDescriptors} from './types'
import dayjs from "dayjs";

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useSupabase } from "components/context/supabase-context";


const _questions: Questions = {
    1: {id: 1, term:"Paris" , text: "... is the capital of France.", specItemId: 0},
    2: {id: 2, term:"London" , text: "... is the capital of England.", specItemId: 0},
    3: {id: 3, term:"Madrid" , text: "... is the capital of Spain.", specItemId: 0},
    4: {id: 4, term:"Skimming", text: "... is the pricing strategy that starts high to take advantage of early adoptions.", specItemId: 1},
    5: {id: 5, term:"Penetration", text: "... is the pricing strategy that prices low to gain market share.", specItemId: 1},
    6: {id: 6, term:"Competition", text: "... is the pricing strategy that bases prices in a similar way to competitors.", specItemId: 1},
};


const queueDescriptions: QueueDescriptors = {
    1: {id:1, label: "Capital Cities"},
    2: {id:2, label: "Pricing Strategies"}
}

const _queue:Queue = [
    {userId: 1, queueId: 1, dueDate: dayjs().subtract(1, 'hour').toDate(), qId: 1, currentQueue: 0, history: []},
    {userId: 1, queueId: 1, dueDate: dayjs().subtract(50, 'minute').toDate(), qId: 2, currentQueue: 0, history: []},
    {userId: 1, queueId: 1, dueDate: dayjs().subtract(40, 'minute').toDate(), qId: 3, currentQueue: 0, history: []}
];

const qt:QueueType = 0; 

const _queues: QueueTypeFilters = {
    [0] : {
        id: 0,
        label: "Today",
        filterFn: (qi:QueueItem) => dayjs(qi.dueDate).toDate() < dayjs().toDate(),
        moveUpFn: (qi: QueueItem) => dayjs(qi.dueDate).add(1, 'day').subtract(1, 'minute').toDate()  
    },
    [1] : {
        id: 1,
        label: "This Week",
        filterFn: (qi:QueueItem) =>  dayjs().toDate() < dayjs(qi.dueDate).toDate() && dayjs(qi.dueDate).toDate() <= dayjs().add(7,'day').toDate(),
        moveUpFn: (qi: QueueItem) => dayjs(qi.dueDate).add(1, 'week').subtract(1, 'minute').toDate()  
    },
    [2] : {
        id: 2,
        label: "This Month",
        filterFn: (qi:QueueItem) =>  dayjs(qi.dueDate).toDate() > dayjs().add(7,'day').toDate(),
        moveUpFn: (qi: QueueItem) => dayjs(qi.dueDate).add(1, 'month').subtract(1, 'minute').toDate()    
    },
}


const moveUpQueue = (qi: FCQueueItem) : FCQueueItem => {
    console.log("Current Queue", qi.currentQueue, " will be ", qi.currentQueue == 0 ? 1 : 2)
    const {currentQueue} = qi;
    //@ts-ignore
    return {...qi, ['dueDate']: _queues[qi.currentQueue].moveUpFn(qi), currentQueue: qi.currentQueue == 0 ? 1 : 2}
}

const resetToToday = (qi: FCQueueItem) : FCQueueItem => {
    return {...qi, ['dueDate']: dayjs().toDate().toString(), currentQueue: 0}
}

const getQueueItems = (queue: Queue, queueType: QueueType) => {
    console.log("QueueType", queueType)
    return queue.filter(_queues[queueType].filterFn).sort((a, b)=> a.dueDate > b.dueDate ? 1 : -1)
}

const getCurrentQuestion = (queue: Queue, questions: Questions, type: QueueType) => {
        
    const queueItems = getQueueItems(queue,type);

    return queueItems.length > 0 ? 
        // get the first question that matches the qId of the first queueItem
        Object.values(questions).filter(q => q.id == queueItems[0].qId)[0] : 

        // else return null, as there were no matching queue Items found
        null;

    
}

type UserQueuResponse = {
    SpecItem: { 
        id: number, 
        tag : string | null,
        title: string | null,
        Spec: {
            title: string | null,
            subject: string | null
        }
    }
}


const FlashCardPage = () => {
    
    const [userId, setUserId] = useState<string>('0d65c82d-e568-450c-a48a-1ca71151e80f')
    
    //Holds a list of all possible queues for this user
    const [userQueues, setUserQueues] = useState<FCGetQueuesReturn | null>(null);

    //Holds the specItemId of the current queue
    const [currentUserQueue, setCurrentUserQueue] = useState(0);

    const [userQueue, setUserQueue] = useState<FCGetQueueReturn | null>(null);

    const [questions, setQuestions] = useState<Questions>(_questions);
    const [currentQueueId, setCurrentQueueId] = useState<number>();
    

    const [currentQueueType, setCurrentQueueType] = useState<QueueType>(0);
    const [queue, setQueue] = useState<Queue>(_queue);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(getCurrentQuestion(_queue, _questions, currentQueueType))
    
    const [state, setState] = useState<string>("front");

    const {supabase} = useSupabase();

    const handleOnClick = (isCorrect: boolean, question: Question) => {

        const tmp = queue.map(qi => {
                
                if (isCorrect && qi.qId === question.id) {
                    // question was correct, so add todays date to the list
                    qi.history.push({date: qi.dueDate, result: true});
                    return qi;
                } 

                if (!isCorrect && qi.qId === question.id) 
                {
                    // answer was incorrect, so set to next day queue and update the history
                    qi.history.push({date: dayjs().toDate(), result: true});
                    return qi;
                }

                return qi;
            });

            setQueue(tmp.sort((a, b) => a.dueDate > b.dueDate ? 1 : -1));
        
    }

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
        
        /* const tmpQueue = queue.map((q => {
            if (q.qId == currentQuestion?.id){
                return {...q, history: [...q.history, {date: dayjs().toDate(), result: choice === currentQuestion.term}]}
            } else {
                return q
            }
        }))
        
        // console.log(tmpQueue);

        
        // setUserQueue(tmpQueue);
        */

        handleToggle();

    }

    const updateDb = async (qi: FCQueueItem)=>{
        const {data, error} = await supabase
        .from ("FCUSerQueueEntries")
        .update({dueDate: qi.dueDate})
        .eq("userId", qi.userId)
        .eq("specItemId", qi.currentQueue)
        .eq("questionId", qi.questionId)
        .select()

        error && console.error("Update Error", error);
        console.log("Update Date",data);
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
                
                const qi = (choice !== q.term) ? moveUpQueue(q): resetToToday(q);
                updateDb(qi);
                return qi;

                return 
            }
            return q;
        })
        
        

        setState("front")
        
        console.log("tmpUserQueue", tmpUserQueue.sort((a,b) => a.dueDate > b.dueDate ? 1 : -1))
        
        // re-order the local queue
        //@ts-ignore
        setUserQueue(tmpUserQueue.sort((a,b) => a.dueDate > b.dueDate ? 1 : -1));
        
    }

    const loadUserQueues = async (userid: string) => {

        const {data, error} = await supabase
                                        .rpc("fn_fc_get_queues", {_userid: userid})
                                        
        console.log("Data", data);
        error && console.error("Error", error);

        //@ts-ignore
        setUserQueues(data);

    }

    const loadUserQueue = async (userid: string, specItemId: number) => {
        const {data, error} = await supabase.rpc("fn_fc_get_queue", {_userid: userid, _specitemid: specItemId});

        error && console.error(error);
        console.log("read from db:", userid, specItemId, data);
        //@ts-ignore
        setUserQueue(data);

    }

    useEffect(()=> {
        // load a list of all queues for this user
        loadUserQueues(userId);
    }, [userId]);

    // list of user queues has changed, so update the current user queue
    useEffect(()=> {

        
        if (!userQueues )
            return;

        
        console.log("Setting userQueue to ", userQueues[0].specItemId);
        setCurrentUserQueue(userQueues[0].specItemId);
    }, [userQueues])


    useEffect(()=> {
        console.log("Get Queue", userId, currentUserQueue)
        loadUserQueue(userId, currentUserQueue)
    }, [
        currentUserQueue
    ])


    useEffect(()=> {
        setCurrentQuestion(getCurrentQuestion(queue, questions, currentQueueType))
    }, [questions])

    useEffect(()=> {
        setCurrentQuestion(getCurrentQuestion(queue, questions, currentQueueType))
    },[queue, currentQueueType]);

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
        {!currentQuestion && <h1>No more questions in queue</h1>}
        {userQueue && currentQuestion && <FlipCardContainer> 
            <FlipCard 
                state={state} 
                question={userQueue[0]} 
                options={Object.values(questions).map(q => q.term)}
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
            <pre>current user queue: {JSON.stringify(currentUserQueue)}</pre>
            <pre>current user queue: {JSON.stringify(userQueue, null, 2)}</pre>
        </div>
        
        </div>
    </>
}


export default FlashCardPage;