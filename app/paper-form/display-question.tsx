import {useEffect, useState} from 'react';
import { Database } from "types/supabase";
import { Spec, SpecItem, SpecData, PupilMarks, Question} from "types/alias";

type DisplayQuestionProps = {
    question : Question,
    specData: SpecData,
    pupilMarks: PupilMarks[],
    onChange : (arg0: number, arg1: number) => void,
    onBlur : (arg0:number) => void
}

const DisplayQuestion = ({question, specData, pupilMarks, onChange, onBlur}: DisplayQuestionProps) => {

    const [value, setValue] = useState<number | null>(null);

    useEffect(()=> {
        setValue(pupilMarks?.filter(pm => pm.questionId === question.id)[0]?.marks)
    }, [pupilMarks]);

    const specItem = specData?.specItem?.filter(s => s.id === question.specItemId)[0];
    
    return <div className="question">
        <div>{question.question_number}</div>
        <input 
            className="input"
            name={question.id.toString()} 
            value={value?.toString() || ''}
            id={question.id.toString()} 
            onChange={(e)=>onChange(question.id, parseInt(e.target.value))}
            onBlur={(e) => onBlur(question.id)}/>
        <div>out of {question.marks} {question.marks == 1 ? 'mark' : 'marks'}</div>
        <div>{specItem?.tag} {specItem?.title}</div>
        <style jsx={true}>{`
        
            .question {
                display : flex;
                flex-direction : row;
            }

            .input {
                text-align : right;
                margin-left: 1rem;
                margin-right: 1rem;
            }
        `}

        </style>
    </div>
}

export default DisplayQuestion;
