
export const dynamic = 'force-dynamic'

import { createSupabaseServerClient } from "app/utils/supabase/server";
import SpecSelector from "./spec-selector";
import styles from "./page.module.css"



const loadSpecItems = async(specId: number) => {

    try {

        const supabase = createSupabaseServerClient();
    
        if (!supabase){
            throw new Error("Supabase client not created")
        }

        const {data, error} = await supabase?.from("SpecItem").select("id, tag, title").eq("SpecId", specId);

        if (error) {
            throw(error.message);
        }; 

        return {specItems: data, error: null}

    } catch(error) {

        console.error(error);

        return {specItems: null, error: error}
    
    }
}

const Page = async ({params}: {params: {specId: number}}) => {

    const {specId} = params;

    const {specItems} = await loadSpecItems(specId);

    return <div>
        <h1>Spec Items for {specId}</h1>
        
        <SpecSelector specId={specId}/>

        {
            specItems?.sort((a, b) => a.tag > b.tag ? 1 : -1)
                .map((si, i) => <div key={i} className={styles.specItemLayout}>
                <div>{si.tag}</div>
                <div>{si.title}</div>
            </div>)
        }

    </div>
}


export default Page;