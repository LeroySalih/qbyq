
import {User} from "@supabase/supabase-js";
import Link from "next/link";
import {Profile} from "../../lib/types";
import {Grid, Paper} from "@mui/material";
import styles from "./index.module.css";

import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';

const Dashboard = ({profile} : {profile: Profile}) => {
    return<>
    <h1>Welcome: {profile.firstName}</h1>

   <div className={styles.cardLayout}>
            <Paper className={styles.card}>
                <div className={styles.title}>
                <LibraryBooksOutlinedIcon fontSize={'large'}/>
                <Link href={`app/spec-report/${profile.id}`}><h3>Past Papers</h3></Link>
                </div>
                <div className={styles.cardText}>
                    Access the past papers that have been assigned, track your scores and revision weak spots. 
                </div>
            </Paper>
        
        
            <Paper className={styles.card}>
            <div className={styles.title}>
                <QuizOutlinedIcon fontSize={'large'}/>
                <Link href={`/learn/gpt/4/1`}><h3>Daily Questions</h3></Link>
                </div>
                <div className={styles.cardText}>
                    Compelete 30 Correct Questions a Day. 
                </div>

                
            </Paper>
            </div>

    </>
}

export default Dashboard;