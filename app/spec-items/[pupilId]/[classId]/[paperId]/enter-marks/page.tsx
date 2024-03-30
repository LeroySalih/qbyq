
import { convertToObject } from "typescript";
import {loadPaperQuestions, loadPaperMarks, loadPaperDetails} from "./load-paper-questions";
import MarksForm from "./marks-form/marks-form";

const merge = (questions: {
    id: number;
    question_number: string;
    marks: number;
    question_order: number;
    tag: string;
    title: string;
}[], marks: {
    id: number;
    questionId: number;
    marks: number;
}[]) => {

    return questions.map(q => {
        
        const matchedAnswer = marks.filter(m => m.questionId == q.id);

        return {...q, 
            qMarks: q.marks,
            markId: matchedAnswer && matchedAnswer.length == 1 ? matchedAnswer[0].id : null,
            marks: matchedAnswer && matchedAnswer.length == 1 ? matchedAnswer[0].marks  : null,
        }
    });
} 

const Page = async ({params} : {params : {pupilId : string, classId: number, paperId: number}}) => {
    const {pupilId, classId, paperId} = params;

    const paperDetails = await loadPaperDetails(paperId);

    const paperQuestions = await loadPaperQuestions(pupilId, classId, paperId);
    

    const paperMarks = await loadPaperMarks(pupilId, paperId);
    

    const paperMarksMerged = merge(paperQuestions, paperMarks);

    return <>
                <h1>Marks Page for: {paperDetails?.year}-{paperDetails?.month}-{paperDetails?.paper}</h1>
                {
                    paperMarksMerged.map((q, i) => <MarksForm questionMark={q} key={i} pupilId={pupilId} paperId={paperId}/>)
                }
                   
            </>
}

export default Page;