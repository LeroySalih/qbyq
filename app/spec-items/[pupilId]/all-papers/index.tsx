
import {Grid, Paper} from "@mui/material";
import { createSupabaseServerClient } from "app/utils/supabase/server";


import styles from "./all-papers.module.css";

import PapersGrid from "./papers-grid";
import {ClassPapers} from "./types";



const AllPapers =  ({papers, pupilId}: 
                    {papers: ClassPapers, pupilId: string}
    ) => {
                

    return <Paper className={styles.layout}><h3>Schedule</h3>
            <PapersGrid classPapers={papers} pupilId={pupilId}/>
    </Paper>
}

export default AllPapers;