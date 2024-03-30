"use client"

import {useState} from "react";
import styles from "./marks-form.module.css"
import { updateQuestionMarks } from "../load-paper-questions";
const MarksForm = ({questionMark, pupilId, paperId} : {questionMark: {
        markId: number | null;
        marks: number | null;
        qMarks: number,
        id: number;
        question_number: string;
        question_order: number;
        tag: string;
        title: string;
    },
    pupilId: string, 
    paperId: number
    }, 
        
    ) => {

    const [answerMarks, setAnswerMarks] = useState<number | null>(questionMark.marks);


    const handleUpdate = (e: any) => {
        
        const updateMarks = answerMarks! > questionMark.qMarks ? questionMark.qMarks : answerMarks;
        setAnswerMarks(updateMarks);
        updateQuestionMarks (pupilId, questionMark.markId!, updateMarks!, paperId, questionMark.id);
    }

    
    return <>
        <form>
            <div className={styles.gridLayout}>
            <div >{questionMark.question_number}</div>
            <div>
            <input name="marks" type="number"  value={answerMarks || "" } className={styles.input} onChange={(e) => setAnswerMarks(parseInt(e.target.value))} onBlur={handleUpdate} />
            &nbsp;({questionMark.qMarks})
            </div>
            <div></div>
            </div>
        </form>
        
    </>
}

export default MarksForm;