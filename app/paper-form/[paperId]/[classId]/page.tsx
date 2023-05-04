import DisplayTabs from './display-tabs';

import Link from 'next/link';

import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {headers, cookies} from 'next/headers';

type PagePropsType = {
       params : {
        paperId: string
       } 
}
const PageForm = async ({params}: PagePropsType) => {

    const {paperId} = params;
    // const [paperId, setPaperId] = useState<number>(1);
    // const [paper, setPaper] = useState<any>()
    // const [pupilMarks, setPupilMarks] = useState<PupilMarks[] | null>(null)
    // const [activeIndex, setActiveIndex] = useState(0);
    // const [files, setFiles] = useState<FileObject[] | null>(null)
    // const [urls, setUrls] = useState<{[key: string] : string} | undefined>({"path" : ''})
    
    // const {user, profile} = useContext(UserContext);


    const supabaseUrl:string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey:string = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

    const supabase = createServerComponentSupabaseClient({
        supabaseUrl,
        supabaseKey,
        headers,
        cookies
    });

    const loadPaper = async (paperId: number) => {

        const {data, error} = await supabase
                                    .from("Papers")
                                    .select('*, Questions!Questions_PaperId_fkey(*), Spec(*, SpecItem(*))')
                                    .eq("id",paperId)
                                    .single();

        error && console.error(error);

        return data;
    }

    const paper = await loadPaper(parseInt(paperId));

    // console.log(user);
    /*
    useEffect( 
        
    ()=> {

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
        
    }, []);
    */


    /*
    useEffect(() => {
        console.log("layout Changed: user")
        const loadPupilMarks = async () => {

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
    */

    /*
    const handleOnBlur = async (questionId:number) => {

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
    */

    


    /*
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
    */

    /*
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
    */

   
    /*
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
    */

    /*
    if (!paper || !profile || !pupilMarks)
        return <Loading/>
    */

    return <>
        <div className="page">
            <Link href="/">Home</Link>
            <h1>{paper?.title} - {paper?.paper}</h1>
            <hr></hr>
            <h3>{paper?.year} - {paper?.month}</h3>

            <DisplayTabs paperId={parseInt(paperId)}/>
    </div>  
    </>
}
export default PageForm;