import {useState} from 'react';
import Button from "@mui/material/Button";
import {Question} from "./types";

type DisplayQuestionProps = {
    question: Question, 
    onClick : (isCorrect : boolean, question: Question) => void
}
const DisplayQuestion = ({question, onClick}:DisplayQuestionProps) => {

    const handleClick = (isCorrect: boolean) => {
        onClick(isCorrect, question);
    }

    return <div>
            <div>{question.text}</div>
            <div>
                <Button variant="outlined" onClick={()=> {handleClick(true)}}>{question.term}</Button>
                <Button variant="outlined" onClick={()=> {handleClick(false)}} >London</Button>
                <Button variant="outlined" onClick={()=> {handleClick(false)}} >Madrid</Button>
            </div>
            <div>
                <Button variant="outlined" disabled={true}>Continue</Button>
            </div>
        </div>
}

export default DisplayQuestion;