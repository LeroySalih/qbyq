"use client"
import supabase from "components/supabase";
import { useEffect , useState, useContext} from "react";
import { Database } from "types/supabase";
import { Spec, SpecItem, SpecData, PupilMarks, Question} from "types/alias";
import { User } from "@supabase/supabase-js";
import { FileObject} from "@supabase/storage-js";
import { UserContext } from "components/context/user-context";

import Loading from "components/loading";
import DisplayQuestion from './display-question';
import DownloadButton from './download-button';

import {Button} from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Link from 'next/link';

const PageForm = () => {

    const [paperId, setPaperId] = useState<number>(1);
    const [paper, setPaper] = useState<any>()
    const [pupilMarks, setPupilMarks] = useState<PupilMarks[] | null>(null)
    const [activeIndex, setActiveIndex] = useState(0);
    const [files, setFiles] = useState<FileObject[] | null>(null)
    const [urls, setUrls] = useState<{[key: string] : string} | undefined>({"path" : ''})

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

    const sumMarks = () => {
        const tMarks = paper.Questions.reduce((prev:number, curr:Question) => prev + (curr.marks || 0), 0)
        const pMarks = pupilMarks?.reduce((prev:number, curr:PupilMarks) => prev + (curr.marks || 0), 0 )
        return <>
                <div>{pMarks} / {tMarks}</div>
                
                </>;
    }

    const rankQuestionNumber = (qNumber:string) : number => {
        // split the quesiton nmber into terms
        const terms = qNumber.split('.')

        // 10.5 => 10 * 10  + 5 * 1
        // 10.5.6 => 10 * 100 + 5 * 10 + 6

        const score =  terms.reduce((prev:number, curr:string, i:number) => {
            prev = prev + (parseInt(curr) * (10 ** (terms.length - i - 1) ))
            return prev
        }, 0);

        
        return score;
    }

    const getPupilMarksForSi = (siId: number) : number => {

        const matchingQuestionIds:number[] = paper.Questions.filter((q:Question) => q.specItemId === siId).map((q:Question) => q.id);
        const matchingPupilMarks = pupilMarks?.filter((p:PupilMarks) => matchingQuestionIds.includes((p.questionId || -1)))
        //console.log("si", siId, matchingQuestionIds, matchingPupilMarks)
        return matchingPupilMarks!.reduce((prev, curr) => prev + (curr.marks || 0), 0)
    }

    const getPaperMarksForSi = (siId: number) : number => {

        const filteredQuestions = paper.Questions.filter((q:Question) => q.specItemId === siId)
        const tMarksForSi = filteredQuestions.reduce((prev:number, curr:Question) => prev + (curr.marks || 0), 0)

        //console.log("siId", siId, filteredQuestions, tMarksForSi);
        return tMarksForSi;
        
    }

/*
    const marksBySpecItem = () => {
        return <><div className="spec-points">
            {paper.Spec.SpecItem.map((si:SpecItem, i:number) => [<div className="question-number">{si.tag}</div>,<div> {si.title}</div>, <div> {getPupilMarksForSi(si.id)}</div>, <div> {getPaperMarksForSi(si.id)}</div>])}
        </div>
        <style jsx={true}>{`
    
    .spec-points {
        display : grid;
        grid-template-columns : 0.25fr 2.75fr 0.25fr 0.25fr;
    }

    .question-number {
        text-align : right;
        margin-right: 1.2rem;
        align-self:center;
    }
`}


</style>
        </>
    }

*/

    const getMarksBySpecItem = () => {
        return paper
                    .Spec
                    .SpecItem
                    .map((si:SpecItem, i:number) => (
                        {"tag" : si.tag, 
                        "title" : si.title, 
                        "pupilMarks" : getPupilMarksForSi(si.id),
                        "questionMarks" : getPaperMarksForSi(si.id)})
                    );
    }
// https://fmudvzcqkiqjyprmtozz.supabase.co/storage/v1/object/public/exam-papers//computer-science/9210-international-gcse-computer-science-mark-scheme-2-v1.0.pdf
// https://fmudvzcqkiqjyprmtozz.supabase.co/storage/v1/object/public/exam-papers//computer-science/9210-international-gcse-computer-science-question-paper-2-v1.0.pdf

// https://fmudvzcqkiqjyprmtozz.supabase.co/storage/v1/object/public/exam-papers//computer-science/9210-international-gcse-computer-science-mark-scheme-2-v1.0.pdf
// https://fmudvzcqkiqjyprmtozz.supabase.co/storage/v1/object/sign/exam-papers/computer-science/9210-international-gcse-computer-science-mark-scheme-2-v1.0.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJleGFtLXBhcGVycy9jb21wdXRlci1zY2llbmNlLzkyMTAtaW50ZXJuYXRpb25hbC1nY3NlLWNvbXB1dGVyLXNjaWVuY2UtbWFyay1zY2hlbWUtMi12MS4wLnBkZiIsImlhdCI6MTY3NDgwNzIwNiwiZXhwIjoxOTkwMTY3MjA2fQ.rWpTf5ySYuav27YkmpXD3DjPERqkscDQQyNYg4cttDY&download

    const getUrl = (fName: string) => {
        return urls![`${paperId}/${fName}`]
    }

    
    if (!paper || !profile || !pupilMarks)
        return <Loading/>

    return <>
        <div className="page">
        <Link href="/">Home</Link>
        <h1>{paper?.title} - {paper?.paper}</h1>
        <hr></hr>
        <h3>{paper?.year}</h3>
    
    
    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        
        
        <TabPanel header="Questions" >
            {sumMarks()}
            {
                paper?.Questions?.sort((a:Question, b:Question) => (rankQuestionNumber(a.question_number || "0.0")) > (rankQuestionNumber(b.question_number || "0.0")) ? 1 : -1)
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
        </TabPanel>
    
        <TabPanel header="Score By Spec">
            <DataTable value={getMarksBySpecItem()} responsiveLayout="scroll">
                <Column field="tag" header="Number" ></Column>
                <Column field="title" header="Question"></Column>
                <Column field="pupilMarks" header="Score" sortable></Column>
                <Column field="questionMarks" header="Marks"></Column>
            </DataTable>
        </TabPanel>

        <TabPanel header="Resources">
            <div>
                <ul>
                {
                files && files
                    .filter(f => f.name != '.emptyFolderPlaceholder')
                    .map((f , i:number) => <li key={i}><a target="new" href={getUrl(f.name)}>{f.name}</a></li>)
                }
                </ul>
            </div>
        </TabPanel>

        {/*
        <TabPanel header="Data">
            <pre>{JSON.stringify(paper, null, 2)}</pre>
        </TabPanel>

        <TabPanel header="Pupil Marks">
            <pre>{JSON.stringify(pupilMarks, null, 2)}</pre>
        </TabPanel>
            */}
    </TabView>

    

    

    
    </div>
   
    </>
}

/*
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
        
    </>
}
*/
export default PageForm;