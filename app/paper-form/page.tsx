"use client"
import supabase from "components/supabase";
import { useEffect , useState} from "react";
import { Database } from "types/supabase";
import { Spec, SpecItem, PupilMarks, Question} from "types/alias";

type SpecData = {
    spec:Spec,
    specItem: SpecItem[]
}

const PageForm = () => {

    const [paper, setPaper] = useState<any>()
    const [pupilMarks, setPupilMarks] = useState<PupilMarks[] | null>(null)

    useEffect( 
        
    ()=> {

        const loadPaper = async () => {

            const {data: paper, error} = await supabase
                                                .from("Papers")
                                                .select('*, Questions(*), Spec(*, SpecItem(*))')
                                                .eq("id",1)
                                                .single();

            error && console.error(error);

            console.log(paper?.title);

            setPaper(paper);

        }

        const loadPupilMarks = async () => {

            const {data, error} = await supabase
                .from("PupilMarks")
                .select();

            
            error && console.error(error);
            console.log(data)
            setPupilMarks(data);
        }

        loadPaper();
        loadPupilMarks();

    }, []);


    const handleOnChange = (questionId: number, marks:number) => {

        const tmpPupilMarks = pupilMarks?.filter(pm => pm.questionId == questionId) || []; 

        console.log(tmpPupilMarks);
        // no pupil marks record exists, so create one
        if (tmpPupilMarks.length === 0){
            tmpPupilMarks.push({
                userId : "8231e1e1-57f8-44f7-b384-9fe2c88d4d0c",
                questionId, 
                marks,
                paperId : paper.id
            })
        } else {
            tmpPupilMarks && (tmpPupilMarks[0].marks = marks)
        }

        

        setPupilMarks(prev => [
            tmpPupilMarks[0], 
            ...(prev || []).filter(pm => pm.questionId != questionId), 
            ])
    }

    const handleOnBlur = async () => {

        const upsertPupilMarks = pupilMarks?.filter(pm => "id" in pm) || [];
        console.log(upsertPupilMarks)
        const {data:upsertData, error:upsertError} = await supabase.from("PupilMarks")
            .upsert(upsertPupilMarks);
            upsertError && console.log(upsertError);
        console.log(upsertData);
        console.log("Upserted");


        
        const {data:InsertData, error: InsertError} = await supabase.from("PupilMarks")
            .insert((pupilMarks || []).filter(pm => !("id" in pm)));
            InsertError && console.log(InsertError);
        console.log(InsertData);
        console.log("Inserted");
        
    }

    return <><h1>Paper Form for {paper?.title}</h1>
    
    {
        
        paper?.Questions?.sort((a:Question, b:Question) => (a.question_number || 0) > (b.question_number || 0) ? 1 : -1)
                .map(
            (q:Question, i:number) => <DisplayQuestion 
                            key={i} 
                            question={q} 
                            specData={paper.Spec} 
                            pupilMarks={(pupilMarks || [])} 
                            onChange={handleOnChange}
                            onBlur={handleOnBlur}
                            />
        )
    }
    <h1>Pupil Marks</h1>
    <pre>{JSON.stringify(pupilMarks, null, 2)}</pre>
    <h1>Paper</h1>
    <pre>{JSON.stringify(paper, null, 2)}</pre>
    </>
}


type DisplayQuestionProps = {
    question : Question,
    specData: SpecData,
    pupilMarks: PupilMarks[],
    onChange : (arg0: number, arg1: number) => void,
    onBlur : () => void
}

const DisplayQuestion = ({question, specData, pupilMarks, onChange, onBlur}: DisplayQuestionProps) => {

    const [value, setValue] = useState<number | null>(null);

    useEffect(()=> {
        setValue(pupilMarks?.filter(pm => pm.questionId === question.id)[0]?.marks)
    }, [pupilMarks]);

    const specItem = specData?.specItem?.filter(s => s.id === question.specItemId)[0];
    
    return <>
        <div>{question.question_number}</div>
        <input 
            name={question.id.toString()} 
            value={value?.toString()}
            id={question.id.toString()} 
            onChange={(e)=>onChange(question.id, parseInt(e.target.value))}
            onBlur={onBlur}/>
        <div>{question.marks}</div>
        <div>{specItem?.tag} {specItem?.title}</div>
        <pre>{JSON.stringify(question, null, 2)}</pre>
    </>
}

export default PageForm;