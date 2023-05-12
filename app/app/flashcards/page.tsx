"use client";


import styles from "./page.module.css";

import {useState, useEffect} from "react";

import Button from '@mui/material/Button';

import DisplayQueues from "./display-queues";
import DisplayQuestion from "./display-question";
import FlipCard, {FlipCardContainer} from './flip-card';

import {Question, Questions, QueueItem, Queue, QueueType, QueueTypeFilter, QueueTypeFilters, QueueDescriptor, QueueDescriptors} from './types'
import dayjs from "dayjs";

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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


const moveUpQueue = (qi: QueueItem) : QueueItem => {
    console.log("Current Queue", qi.currentQueue, " will be ", qi.currentQueue == 0 ? 1 : 2)
    return {...qi, ['dueDate']: _queues[qi.currentQueue].moveUpFn(qi), currentQueue: qi.currentQueue == 0 ? 1 : 2}
}

const resetToToday = (qi: QueueItem) : QueueItem => {
    return {...qi, ['dueDate']: dayjs().toDate(), currentQueue: 0}
}

const getQueueItems = (queue: Queue, queueType: QueueType) => {
    console.log("QueueType", queueType)
    return queue.filter(_queues[queueType].filterFn).sort((a, b)=> a.dueDate > b.dueDate ? 1 : -1)
}

const FlashCardPage = () => {

    const getCurrentQuestion = (queue: Queue, questions: Questions, type: QueueType) => {
        
        const queueItems = getQueueItems(queue,type);

        return queueItems.length > 0 ? 
            // get the first question that matches the qId of the first queueItem
            Object.values(questions).filter(q => q.id == queueItems[0].qId)[0] : 

            // else return null, as there were no matching queue Items found
            null;

        
    }

    
    
    const [questions, setQuestions] = useState<Questions>(_questions);
    const [currentQueueId, setCurrentQueueId] = useState<number>(0);

    const [currentQueueType, setCurrentQueueType] = useState<QueueType>(0);
    const [queue, setQueue] = useState<Queue>(_queue);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(getCurrentQuestion(_queue, _questions, currentQueueType))
    
    const [state, setState] = useState<string>("front");

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

    const handleAnswer = (choice: string) => {
        // update queue history 

        const tmpQueue = queue.map((q => {
            if (q.qId == currentQuestion?.id){
                return {...q, history: [...q.history, {date: dayjs().toDate(), result: choice === currentQuestion.term}]}
            } else {
                return q
            }
        }))
        
        console.log(tmpQueue);
        setQueue(tmpQueue);

        handleToggle();

    }

    const handleNext = (choice: string) => {
        const tmp = queue.map((qi) => {
            
            if (qi.qId === currentQuestion!.id) {
                console.log("Matched!");

                // answer is incorrect, so add to tomorrow queue.
                if (choice !== currentQuestion!.term){
                    console.log("Resetting to queue 0", choice, currentQuestion!.term)
                    return resetToToday(qi);
                }
                    
                // answer is correct so move up dueDate
                console.log("Moving Up Queue")
                return moveUpQueue(qi);
                
            }
            return qi;
        });

        setState("front")
        console.log("tmp",tmp)
        setQueue(tmp.sort((a,b) => a.dueDate > b.dueDate ? 1 : -1));
        
    }

    useEffect(()=> {
        setCurrentQuestion(getCurrentQuestion(queue, questions, currentQueueType))
    }, [questions])

    useEffect(()=> {
        setCurrentQuestion(getCurrentQuestion(queue, questions, currentQueueType))
    },[queue, currentQueueType]);

    return <>
        <h1>Flash Cards</h1>
        {
            <Select value={currentQueueId} onChange={(e) => setCurrentQueueId(e.target.value as number)}>
                {
                    Object.values(queueDescriptions).map((qd, i) => <MenuItem key={i} value={qd.id}>{qd.label}</MenuItem>)
                }
            </Select>

        }
        { //@ts-ignore
        <Select value={currentQueueType} onChange={(e) => setCurrentQueueType(parseInt(e.target.value))}>
            {Object.values(_queues).map((qi:QueueTypeFilter,i) => <MenuItem key={i} value={qi.id.toString()}>{qi.label}</MenuItem>)}
        </Select>
        }
        
        <div className={styles.pageGrid}>

        {!currentQuestion && <h1>No more questions in queue</h1>}
        {questions && currentQuestion && <FlipCardContainer> 
            <FlipCard 
                state={state} 
                question={currentQuestion} 
                options={Object.values(questions).map(q => q.term)}
                onClick={handleAnswer}
                onNext={handleNext}
            />
        </FlipCardContainer>
        }
        <DisplayQueues queue={queue}/>
        <pre>{JSON.stringify(queue, null, 2)}</pre>
        
        </div>
    </>
}







export default FlashCardPage;