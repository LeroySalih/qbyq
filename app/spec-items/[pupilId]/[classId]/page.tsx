import {Paper} from "@mui/material";
import styles from "./page.module.css";
import ClassGraph from "./class-graph";
import DisplaySpecItems from "./display-spec-items";
import supabase from "app/utils/supabase/client";
import { createSupabaseServerClient } from "app/utils/supabase/server";

const Page = async ({params} : {params : {pupilId: string, classId : string, }}) => {
    
    const {pupilId: _pupilId} = params;
    const _classId = parseInt(params.classId);

    const loadPupilSpecItemData = async (_pupilid : string, _classid : number) => {
        
        try {

            const supabase = createSupabaseServerClient();

            if (!supabase){
                throw (new Error("Supabase not created"))
            }

            // fn_get_specItemMarks_for_pupil_class
            console.log({_pupilId, _classId});
            const {data, error} = await supabase.rpc ("fn_get_specitemmarks_for_pupil_class", {_pupilid, _classid});

            if (error){
                console.error(error);
            }

            return data;
        } catch(error: any) {
            console.error(error.message);
            throw (new Error(error.message));
        }
        
    }

    const specItems = await loadPupilSpecItemData(_pupilId, _classId);

     return <>
            <Paper className={styles.mainPage}>
                <h1>Details for {_pupilId} - {_classId}</h1>
                <h3></h3>
                <pre>{JSON.stringify(specItems, null, 2)}</pre>
                <ClassGraph />
                <DisplaySpecItems />
                
            </Paper>
        </>
}
export default Page;