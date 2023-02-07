"use client"
import supabase from "components/supabase";
import { useEffect , useState, useContext} from "react";
import { Database } from "types/supabase";
import { Spec, SpecItem, SpecData, PupilMarks, Question, PupilMarksForSpec} from "types/alias";
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
import { umask } from "process";

type PagePropsType = {
       params : {
        paperId: string
       } 
}
const PageForm = ({params}: PagePropsType) => {

    const {paperId} = params;
    // const [paperId, setPaperId] = useState<number>(1);
    const [paper, setPaper] = useState<any>()
    const [pupilMarks, setPupilMarks] = useState<PupilMarks[] | null>(null)
    const [activeIndex, setActiveIndex] = useState(0);
    const [files, setFiles] = useState<FileObject[] | null>(null)
    const [urls, setUrls] = useState<{[key: string] : string} | undefined>({"path" : ''})

    const {user, profile} = useContext(UserContext);

    const [userFiles, setUserFiles] = useState<{ name: string; signedUrl: string; }[] | undefined>([]);
    
    const loadFiles = async () => {

        const path =  `${user!.id}/${paperId}`
        const {data: listFiles, error} = await supabase.storage
                        .from('exam-papers')
                        .list(path, {
                            limit: 100,
                            offset: 0,
                            sortBy: { column: 'name', order: 'asc' },
                          });

        const {data: downloadUrls, error: downloadError }  = await supabase.storage
                        .from('exam-papers')
                        .createSignedUrls(listFiles?.map(lf => `${path}/${lf.name}`) || [], 3600, {download: true})

        error && console.error(error)
                
        console.log("Files", downloadUrls);

        setUserFiles(listFiles?.map(
                (lf, i) => (
                    {   
                        name: lf.name, 
                        signedUrl: downloadUrls![i].signedUrl
                    } || {}
                    ) 
                )
        )
    }

    


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
        loadFiles();
        // loadSpecData(1, user.id);

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

        return tMarksForSi;
        
    }



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

    const getUrl = (fName: string) => {
        return urls![`${paperId}/${fName}`]
    }

    const handleFileChange = async (e:any) => {
        console.log(e.target.files[0])

        const uploadFile = e.target.files[0];
        const {data, error} = await supabase
                                        .storage
                                        .from('exam-papers')
                                        .upload(`/${user!.id}/${paperId}/${uploadFile.name}`, uploadFile, {
                                            cacheControl: '3600',
                                            upsert: false
                                            });

        error && console.error(error);
        console.log(data)

        loadFiles();
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
                paper?.Questions?.sort((a:Question, b:Question) => a.question_order! > b?.question_order! ? 1 : -1)
                        .map(
                    (q:Question, i:number) => <DisplayQuestion 
                                    key={i} 
                                    question={q} 
                                    specItems={paper.Spec.SpecItem} 
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
        <TabPanel header="Files">
            <input type="file" name="upload" onChange={handleFileChange}/>
            <ul>
            {userFiles && userFiles.map((uf,i) => <li><Link href={uf.signedUrl} key={i}>{uf.name}</Link></li>)}
            </ul>
           
        </TabPanel>

    </TabView>

    

    

    
    </div>
   
    </>
}


export default PageForm;