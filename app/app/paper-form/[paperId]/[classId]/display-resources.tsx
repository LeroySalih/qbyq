import supabase from "components/supabase";
import {ClassPaperResources} from "types/alias";

type DisplayResourcesPropsType = {
    paperId : number, 
    classId : number
}

type LoadResourcesReturn = Promise<ClassPaperResources>;

const DisplayResources = async (props: DisplayResourcesPropsType): Promise<JSX.Element> => {
    
    const {paperId, classId} = props;
    
    const loadResources = async (classId : number) => {

        const {data, error} = await supabase.from("ClassPaperResources")
                                        .select()
                                        .eq("paperId", paperId)
                                        .eq("classId", classId);
        
        return data || [];
    }

    const resources = await loadResources(classId);
    
    const loadUrls = async (resources:ClassPaperResources[]) => {

        
        const fileNames:string[] = resources!.map<string>(r => `${r.paperId}/${r.label}`);

        const {data, error} = await supabase
                        .storage
                        .from('exam-papers')
                        .createSignedUrls(fileNames, 3600);

        error && console.error(error);

        return data || [];
    }

    const urls = await loadUrls(resources)

    return <div>
        <h1>Page Resources </h1>        
        <div>
            {
                urls && urls.map((r, i) => <div key={i} ><a target="_new" href={r.signedUrl}>{r.path?.split('/')[1]}</a></div>)
            }
        </div>
    </div>
}


export default DisplayResources;
