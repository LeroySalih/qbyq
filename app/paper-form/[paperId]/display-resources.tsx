import { UserContext,  } from "components/context/user-context";
import { useContext, useEffect, useState, FC} from 'react';
import supabase from "components/supabase";

interface DisplayResourcesPropsType {

    paperId : number 
}

const DisplayResources: FC<DisplayResourcesPropsType> = (props: DisplayResourcesPropsType): JSX.Element => {
    
    const {paperId} = props;
    const {profile, classes} = useContext(UserContext);
    const [resources, setResources] = useState(null);
    const [fileUrls, setFileUrls] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadResources = async () => {

        if (!classes) return;


        // @ts-ignore
        const classArray = classes!.map((c, i) => c!.Classes.id);
        console.log("Classes", classArray, "PaperId", paperId);
        
        if (classArray.length > 0){
            console.log("Getting data");
            const {data, error} = await supabase.from("ClassPaperResources")
                                        .select()
                                        .eq("paperId", paperId)
                                        .in("classId",classArray);
        
            error && console.error(error);
            console.log("Data", data);
            // @ts-ignore
            setResources(data);
        }
        
    }

    const loadUrls = async () => {

        if (!resources) return;

        // @ts-ignore
        const fileNames = resources!.map(r => `${r.paperId}/${r.label}`)
        console.log("fileNames", fileNames);
        
        const {data, error} = await supabase
                        .storage
                        .from('exam-papers')
                        .createSignedUrls(fileNames, 3600);

        error && console.error(error);

        //@ts-ignore
        setFileUrls(data);
        //@ts-ignore
        setIsLoading(false);

                    
    }

    useEffect(()=> {

        loadResources()

    }, 
    
    [classes]);


    useEffect(()=> {
        loadUrls()
    }, [resources])

    if (isLoading) return <h3>Loading...</h3>
    return <div>
        <h1>Page Resources </h1>
        
        <div>
            {
                // @ts-ignore
                fileUrls && fileUrls.map((r, i) => <div key={i} ><a target="_new" href={r.signedUrl}>{r.path.split('/')[1]}</a></div>)
                }
        </div>
    </div>
}


export default DisplayResources;
