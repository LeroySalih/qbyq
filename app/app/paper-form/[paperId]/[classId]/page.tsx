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

    return <>
        <div className="page">
            
            <h1>{paper?.title} - {paper?.paper}</h1>
            <hr></hr>
            <h3>{paper?.year} - {paper?.month}</h3>

            <DisplayTabs paperId={parseInt(paperId)}/>
    </div>  
    </>
}
export default PageForm;