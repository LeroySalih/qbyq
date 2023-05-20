import {useState} from 'react';
import Button from "@mui/material/Button";
import {FCQueueItem} from "types/alias";

type DisplayQuestionProps = {
    queueItem: FCQueueItem, 
    onClick : (isCorrect : boolean, queueItem: FCQueueItem) => void
}
const DisplayQuestion = ({queueItem, onClick}:DisplayQuestionProps) => {

    const handleClick = (isCorrect: boolean) => {
        onClick(isCorrect, queueItem);
    }

    return <div>
            <div>{queueItem.text}</div>
            <div>
                <Button variant="outlined" onClick={()=> {handleClick(true)}}>{queueItem.term}</Button>
                
                {
                    queueItem.distractors.map((d:string, i: number) => <Button key={i} variant="outlined" onClick={()=> {handleClick(false)}} >{d}</Button>)
                }
            </div>
            <div>
                <Button variant="outlined" disabled={true}>Continue</Button>
            </div>
        </div>
}

export default DisplayQuestion;