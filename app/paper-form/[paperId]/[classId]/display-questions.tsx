"use client";

import { useEffect , useState, useContext} from "react";
import { SupabaseContext } from "components/context/supabase-context";
import { UserContext } from "components/context/user-context";

import DisplayQuestion from "./display-question";
import { FileObject} from "@supabase/storage-js";
import {  PupilMarks, Question,} from "types/alias";
import Loading from "components/loading";

const DisplayQuestions = ({paperId} : {paperId : number}) => {

    const [paper, setPaper] = useState<any>()
    const {supabase} = useContext(SupabaseContext);

    const [files, setFiles] = useState<FileObject[] | null>(null)
    const [urls, setUrls] = useState<{[key: string] : string} | undefined>({"path" : ''})
    const [pupilMarks, setPupilMarks] = useState<PupilMarks[] | null>(null);

    const {user, profile} = useContext(UserContext);

    useEffect( 
        
        ()=> {
            if (!supabase)
                return;

            const loadPaper = async () => {
    
                const {data: paper, error} = await supabase
                                                    .from("Papers")
                                                    .select('*, Questions!Questions_PaperId_fkey(*), Spec(*, SpecItem(*))')
                                                    .eq("id",paperId)
                                                    .single();
    
                error && console.error(error);
    
                console.log(paper?.title);
    
                setPaper(paper);
    
            }
    
            const loadResources  = async () => {
    
                const {data, error} = await supabase
                                                .storage
                                                .from('exam-papers')
                                                .list(`${paperId}`)
    
                error && console.error(error);
    
                // upload the files
                setFiles(data);
    
                const {data: urlsData, error: urlsError} = await supabase
                                                    .storage 
                                                    .from('exam-papers')
                                                    .createSignedUrls(data?.map(d => (`${paperId}/${d.name}`)) || [], 3600)
    
                urlsError && console.error(urlsError);
                const urlDataObject = urlsData?.reduce(
                                            (prev:{[key:string]:string}, curr)=> {prev[curr.path || 'default'] = curr.signedUrl; return prev},
                                            {}
                                            );
                setUrls(urlDataObject);
    
            }
    
            loadPaper();
            loadResources();
            
        }, [supabase]);

    useEffect(() => {
        console.log("layout Changed: user")
        const loadPupilMarks = async () => {
            
            if (!supabase)
                return;

            const {data, error} = await supabase
                .from("PupilMarks")
                .select()
                // bug investigate
                .eq("userId", user!.id)
                // .eq("userId", 'e20c74ef-fefe-4c74-aece-1ea567ef5f4f')
                .eq("paperId", paperId);

            error && console.error(error);
            // console.log(data);
            setPupilMarks(data);
        }

        if (user === undefined)
            return;

        loadPupilMarks();
        // loadFiles();
        // loadSpecData(1, user.id);

    }, [user]);

    const loadPaper = async () => {

        const {data: paper, error} = await supabase?.from("Papers")
                                            .select('*, Questions!Questions_PaperId_fkey(*), Spec(*, SpecItem(*))')
                                            .eq("id",paperId)
                                            .single() || {data: null, error: null};

        error && console.error(error);

        console.log(paper?.title);

        setPaper(paper);

    }

    const sumMarks = () => {
        const tMarks = paper.Questions.reduce((prev:number, curr:Question) => prev + (curr.marks || 0), 0)
        const pMarks = pupilMarks?.reduce((prev:number, curr:PupilMarks) => prev + (curr.marks || 0), 0 )
        return <>
                <div>{pMarks} / {tMarks}</div>
                
                </>;
    }

    const handleOnChange = (questionId: number, marks:number) => {

        const tmpPupilMarks = pupilMarks?.filter(pm => pm.questionId == questionId) || []; 

        console.log(marks);
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

        if (!supabase)
            return;
            
        // get the pupilMark by question id
        const pm = pupilMarks?.filter(pm => pm.questionId === questionId)[0]

        if (pm === undefined){
            return;
        }

        const {data:upsertData, error:upsertError} = await supabase
                                                .rpc("fn_upsert_pupilmarks", {
                                                    _userid : pm.userId,
                                                    _paperid : pm.paperId,
                                                    _questionid : pm.questionId,
                                                    _marks : (pm.marks || 0)
                                                })

        if (upsertError){
            console.log(upsertError);
            return;
        } else {
            console.log("Upserted", pm, "returned", upsertData)
        }

        console.log("Upsert Data", upsertData)

        

        
    }

    return <>
    {sumMarks()}
    {
        paper?.Questions?.sort((a:Question, b:Question) => a.question_order! > b?.question_order! ? 1 : -1)
                .map(
            (q:Question, i:number) => <DisplayQuestion 
                            key={`q${i}`} 
                            question={q} 
                            specItems={paper.Spec.SpecItem} 
                            pupilMarks={(pupilMarks || [])} 
                            onChange={handleOnChange}
                            onBlur={handleOnBlur}
                            />
        )
    }
    </>
}

export default DisplayQuestions;