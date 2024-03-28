
import loadPaperQuestions from "./load-paper-questions";

const Page = async ({params} : {params : {pupilId : string, classId: number, paperId: number}}) => {
    const {pupilId, classId, paperId} = params;

    const paperQuestions = await loadPaperQuestions(pupilId, classId, paperId);

    return <>
                <h1>Marks Page for: {pupilId}, {classId}, {paperId}</h1>
                {
                    
                }
                <pre>{JSON.stringify(paperQuestions, null, 2)}</pre>    
            </>
}

export default Page;