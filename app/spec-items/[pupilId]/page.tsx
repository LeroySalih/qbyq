
import {Paper, Grid} from "@mui/material";
import styles from "./page.module.css";
import getAllPapers from "./all-papers";
import AllPapers from "./all-papers";

import { createSupabaseServerClient } from "app/utils/supabase/server";

const Page = async ({params} : {params : {pupilId : string}}) => {

     const loadPapers = async (pupilId: string) => {
          try {
               const supabase = createSupabaseServerClient(false);

               if (!supabase){
                    throw new Error("Supabase not created")
               }

               const {data, error} = await supabase.rpc("fn_get_paper_details_for_pupil", {_owner:pupilId});

               if (error){
                    throw new Error(error.message);
               }

               return data;

          } catch(error) {
               console.error(error);
               return [];
          }
          
     }

     const {pupilId} = params;

     // const allPapersGrid = await AllPapers(pupilId);
     const papers = await loadPapers(pupilId);

     return <>
          <AllPapers papers={papers} pupilId={pupilId}/>         
     </>
}
export default Page;