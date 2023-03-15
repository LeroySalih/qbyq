import {useEffect, useState, useRef} from 'react';
import { Database } from "types/supabase";
import { Spec, SpecItem, SpecData, PupilMarks, Question} from "types/alias";
import { isVariableDeclarationList } from 'typescript';
import {InputNumber} from 'primereact/inputnumber';
import styles from './display-question.module.css';


type DisplayQuestionProps = {
    question : Question,
    specItems: SpecItem[],
    pupilMarks: PupilMarks[],
    onChange : (arg0: number, arg1: number) => void,
    onBlur : (arg0:number) => void
}


type FieldData = {
    isValid: boolean | null,
    errorMessage: string | null
}





const DisplayQuestion = ({question, specItems, pupilMarks, onChange, onBlur}: DisplayQuestionProps) => {

    const [value, setValue] = useState<number | null>(null);
    const [fieldData, setFieldData] = useState<FieldData>({isValid : null, errorMessage: null });
    const [specItem, setSpecItem] = useState<SpecItem | null>(null);
    
    const textInput = useRef<any>(null);

    const setValueState = () => {}
    useEffect(()=> {
        setValue(pupilMarks?.filter(pm => pm.questionId === question.id)[0]?.marks);

        setSpecItem (specItems.filter(sp => sp.id === question.specItemId)[0])
    }, [pupilMarks]);


    const handleOnBlur = () => {

        if (value! < 0) {
            setFieldData({
                isValid: false, 
                errorMessage : `Can not be less than 0.`});

            //setValue(0);
            onChange(question.id, 0);
            setValue(0);

            // @ts-ignore
            textInput?.current.focus();
            return;
        }


        if (value! > question.marks!){
            setFieldData({
                isValid: false, 
                errorMessage : `Can not be greater than ${question.marks} ${question.marks === 1 ? 'mark' : 'marks' }.`});

            //setValue(0);
            
            onChange(question.id, question.marks || 0);
            setValue(question.marks);

            // @ts-ignore
            textInput?.current.focus();
            return;
        } 
            
        
        setFieldData({isValid: true, errorMessage : null})
        // notify parent that change has occured
        onBlur(question.id)    
    }


    return <div className="question">
        <div className="question-number">{question.question_number}</div>
        <InputNumber 
            className={`${styles['p-inputtext']} input ${fieldData.isValid === false && 'p-invalid'}`}
            name={question.id.toString()} 
            value={value}
            id={question.id.toString()} 
            
            ref={textInput}
            onChange={(e)=>onChange(question.id, e.value || 0)}
            onBlur={handleOnBlur}/>
        <div className="question-marks">
            out of {question.marks} {question.marks == 1 ? 'mark' : 'marks'}
        </div>
        
        <div className="specItemTag">{specItem?.tag}</div>
        <div className="specItemTitle">{specItem?.title}({question.question_order})</div>
        
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

            .specItemTag {
                color: silver;
                font-size: 0.8rem;
                text-align: right;
                padding-right: 1rem;
                margin-bottom: 1rem;

            }

            .specItemTitle {
                grid-column-start : 2;
                grid-column-end: 4;
                color: silver;
                font-size: 0.8rem;
                
            }

            
        `}

        </style>
    </div>
}

export default DisplayQuestion;
