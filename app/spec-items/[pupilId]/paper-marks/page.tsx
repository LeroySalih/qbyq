
import loadPaperQuestions from "../[classId]/[paperId]/enter-marks/load-paper-questions";

const Page = async ({params} : {params : {pupilId : string, classId: number, paperId: number}}) => {
    const {pupilId, classId, paperId} = params;

    const paperQuestions = loadPaperQuestions(pupilId, classId, paperId);

    return <>
                <h1>Questions Page for: {pupilId}, {classId}, {paperId}</h1>
                <pre>{JSON.stringify(paperQuestions)}</pre>    
            </>
}

export default Page;
