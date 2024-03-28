import { ReactNode } from "react";
import styles from "./layout.module.css";
import { Grid, Paper } from "@mui/material";
import Link from "next/link";
import { log } from "console";

const Layout = async ({children, header, params} : {children: ReactNode, header: ReactNode, params: {pupilId: string}}) => {

    const {pupilId} = params;

    return <>
        <div className={styles.layout}>
        {header}
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} md={3}>
                <Paper className={styles.sidebar} elevation={0}>
                    <div>
                        <div>
                            <Link href={`/spec-items/${pupilId}`}>Home</Link>
                        </div>
                        <div>Classes</div>
                        {[{classTitle:'23-11-BS1', papers: ['2018-Jun', '2019-Jun']}, {classTitle:'23-11-EC', papers: ['2022-Jun']}, {classTitle:'23-11CS'}].map((c: { classTitle: string; papers: string[]; } | { classTitle: string; papers?: undefined; }, i:number ) => <div key={i} className={styles.link}>
                            <Link  href={`/spec-items/${pupilId}/${c?.classTitle}`}>{c?.classTitle}</Link>
                            <ul>
                                {c.papers && c.papers.map((p: string, i: number) => <li key={i}>
                                    <Link href={`/spec-items/${pupilId}/${c.classTitle}/${p}/enter-marks`}>{p}</Link>
                                </li>)}
                            </ul>
                            </div>)}
                    </div>
                </Paper>
            </Grid>

            <Grid item xs={12} md={9}>
                {children}
            </Grid>
        </Grid>
        
        </div>
        </>
}

export default Layout;