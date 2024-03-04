import DisplayTabs from './display-tabs';

import { createSupabaseServerClient } from 'app/utils/supabase/server';
import DisplayResources from './display-resources';

type PagePropsType = {
       params : {
        paperId: string
       } 
}
const PageForm = async ({params}: PagePropsType) => {

    const {paperId} = params;
    
    console.log(paperId);
   
    const supabase = createSupabaseServerClient()

    if (!supabase) {
        return <h1>Error: Creating Supabase</h1>;
    }

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
            
            <h1>{paper?.title} :: {paper?.paper}</h1>
            <hr></hr>
            <div style={{display: "flex", flexDirection:"row", alignItems:"center"}}>
            <h3>{paper?.year} - {paper?.month}</h3>
            <DisplayResources />
            </div>
            <DisplayTabs paperId={parseInt(paperId)}/>
    </div>  
    </>
}
export default PageForm;