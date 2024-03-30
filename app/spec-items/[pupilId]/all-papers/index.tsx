
import {Grid, Paper} from "@mui/material";
import { createSupabaseServerClient } from "app/utils/supabase/server";


import styles from "./all-papers.module.css";

import PapersGrid from "./papers-grid";
import {ClassPapers} from "./types";

const AllPapers = async (pupilId: string) => {
    const supabase = createSupabaseServerClient(false);
    
    if (!supabase) {
        throw Error("getAllPapers::Supabase not created");
    }

    const {data: classes, error: classesError} = await supabase.from("ClassMembership").select("classId").eq("pupilId", pupilId);


    const {data : classPapers, error} = await supabase.from("vw_papers_for_classes")
                .select("tag, specId, year, month, paper, title, paperId, classId, availableFrom, completeBy, markBy")
                /* @ts-expect-error */
                .in("classId", classes?.map(c => c.classId))
                .returns<ClassPapers>();
                

    return <Paper className={styles.layout}><h3>Schedule</h3>
        <PapersGrid classPapers={classPapers!} pupilId={pupilId}/>
        
    </Paper>
}

export default AllPapers;