import {useEffect, useState} from 'react';
import { Database } from "types/supabase";
import { Spec, SpecItem, SpecData, PupilMarks, Question} from "types/alias";
import { isVariableDeclarationList } from 'typescript';
import {InputNumber} from 'primereact/inputnumber';

type DisplayQuestionProps = {
    question : Question,
    specData: SpecData,
    pupilMarks: PupilMarks[],
    onChange : (arg0: number, arg1: number) => void,
    onBlur : (arg0:number) => void
}


type FieldData = {
    isValid: boolean | null,
    errorMessage: string | null
}

const DisplayQuestion = ({question, specData, pupilMarks, onChange, onBlur}: DisplayQuestionProps) => {

    const [value, setValue] = useState<number | null>(null);
    const [fieldData, setFieldData] = useState<FieldData>({isValid : null, errorMessage: null });

    useEffect(()=> {
        setValue(pupilMarks?.filter(pm => pm.questionId === question.id)[0]?.marks)
    }, [pupilMarks]);


    const handleOnBlur = () => {

        if (value! > question.marks!){
            setFieldData({
                isValid: false, 
                errorMessage : `Can not be greater than ${question.marks} ${question.marks === 1 ? 'mark' : 'marks' }.`})
        } else {
            setFieldData({isValid: true, errorMessage : null})
            // notify parent that change has occured
            onBlur(question.id)
        }

        
    }
    return <div className="question">
        <div className="question-number">{question.question_number}</div>
        <InputNumber 
            className={`input ${fieldData.isValid === false && 'p-invalid'}`}
            name={question.id.toString()} 
            value={value}
            id={question.id.toString()} 
            onChange={(e)=>onChange(question.id, e.value || 0)}
            onBlur={handleOnBlur}/>
        <div className="question-marks">
            out of {question.marks} {question.marks == 1 ? 'mark' : 'marks'}
        </div>
        
        <div></div><div className="errorMessage">{fieldData.errorMessage}</div>
        <style jsx={true}>{`
        
            .question {
                display : grid;
                grid-template-columns: 1fr 1fr 1fr;
            }

            .question-number {
                text-align : right;
                margin-right: 1.2rem;
                align-self:center;
            }

            .input {
                text-align: right;
                margin-left: 1rem;
                margin-right: 1rem;
                font-family: 'Poppins';
                font-size: 1rem;
                margin: 0.1rem;
                border-radius: 0.3rem;
                border: solid 1px silver;
            }

            

            .question-marks {
                text-align : left;
                margin-right: 1.2rem;
                align-self:center;
                margin-left: 2rem;
            }

            .errorMessage {
                grid-column-start : 2;
                grid-column-end: 4;
                color: red;
                font-size: 0.8rem;
            }

            
        `}

        </style>
    </div>
}

export default DisplayQuestion;
