"use client"
import supabase from "components/supabase";
import { useEffect , useState, useContext} from "react";
import { Database } from "types/supabase";
import { Spec, SpecItem, PupilMarks, Question} from "types/alias";
import { User } from "@supabase/supabase-js";
import { UserContext } from "components/context/user-context";

import Loading from "components/loading";

type SpecData = {
    spec:Spec,
    specItem: SpecItem[]
}

const PageForm = () => {

    const [paperId, setPaperId] = useState<number>(1);
    const [paper, setPaper] = useState<any>()
    const [pupilMarks, setPupilMarks] = useState<PupilMarks[] | null>(null)

    const {user, profile} = useContext(UserContext);
    // console.log(user);
    useEffect( 
        
    ()=> {

        const loadPaper = async () => {

            const {data: paper, error} = await supabase
                                                .from("Papers")
                                                .select('*, Questions(*), Spec(*, SpecItem(*))')
                                                .eq("id",paperId)
                                                .single();

            error && console.error(error);

            console.log(paper?.title);

            setPaper(paper);

        }

        
        loadPaper();
        

    }, []);


    useEffect(() => {

        const loadPupilMarks = async () => {

            const {data, error} = await supabase
                .from("PupilMarks")
                .select()
                .eq("userId", user!.id)
                .eq("paperId", paperId);

            error && console.error(error);
            // console.log(data);
            setPupilMarks(data);
        }

        if (user === undefined)
            return;

        loadPupilMarks();

    }, [user])


    const handleOnChange = (questionId: number, marks:number) => {

        const tmpPupilMarks = pupilMarks?.filter(pm => pm.questionId == questionId) || []; 

        // no pupil marks record exists, so create one
        if (tmpPupilMarks.length === 0){
            tmpPupilMarks.push({
                userId : user!.id ,
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



    const handleOnBlur = async (questionId:number) => {

        // get the pupilMark by question id
        const pm = pupilMarks?.filter(pm => pm.questionId === questionId)[0]

        if (pm === undefined){
            return;
        }


        const {data:upsertData, error:upsertError} = await supabase
                .from("PupilMarks")
                .upsert(pm)
                .select();
        
        if (upsertError){
            console.log(upsertError);
            return;
        }

        console.log("Upsert Data", upsertData)

        const newPupilMarks = pupilMarks?.map((old) => (old.questionId === pm.questionId) 
                ? upsertData![0]
                : old
            );

            // update the pupil marks data
        setPupilMarks(newPupilMarks || [])

        
    }

    
    if (!paper || !profile || !pupilMarks)
        return <Loading/>

    return <><h1>Paper Form for {paper?.title}:: {`${profile?.firstName} ${profile?.familyName}`}</h1>
    
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
    onBlur : (arg0:number) => void
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
            value={value?.toString() || ''}
            id={question.id.toString()} 
            onChange={(e)=>onChange(question.id, parseInt(e.target.value))}
            onBlur={(e) => onBlur(question.id)}/>
        <div>{question.marks}</div>
        <div>{specItem?.tag} {specItem?.title}</div>
        <pre>{JSON.stringify(question, null, 2)}</pre>
    </>
}

export default PageForm;