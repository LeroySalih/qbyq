import { ReactNode } from "react";
import styles from "./layout.module.css";
import { Grid, Paper, paperClasses } from "@mui/material";
import Link from "next/link";
import { log } from "console";

import { createSupabaseServerClient } from "app/utils/supabase/server";
import { DateTime } from "luxon";




const loadPapersForClasses = async (classIds : number[]) => {

    try {

        const supabase = createSupabaseServerClient(false);

        if (!supabase){
            throw("Supabase not created.");
        }

        const {data, error} = await supabase.from("ClassPapers").select("classId, paperId, availableFrom, completeBy, markBy, Classes(tag), Papers(id, year, month, paper)")
                                            .in("classId", classIds)
                                            .returns<{
                                                classId: number,
                                                paperId: number, 
                                                availableFrom: string,
                                                completeBy: string,
                                                markBy: string,
                                                Classes : {
                                                    tag: string
                                                },
                                                Papers : {
                                                    id: number, 
                                                    year: string,
                                                    month: string, 
                                                    paper: string
                                                }
                                            }[] >();
                                            

        if (error){
            throw new Error(error.message);
        }

        return data.map((cp) => ({
            classId : cp.classId, 
            tag: cp.Classes.tag,
            availableFrom: cp.availableFrom,
            completeBy: cp.completeBy,
            markBy: cp.markBy,
            paperId : cp.paperId, 
            year: cp.Papers.year, 
            month: cp.Papers.month, 
            paper: cp.Papers.paper
        }));

    } catch (error) {
        console.error(error);
        return [];
    }
} 

const loadClassesForPupil = async (pupilId : string) => {

    try {

        const supabase = createSupabaseServerClient(false);

        if (!supabase){
            throw("Supabase not created.");
        }

        const {data, error} = await supabase.from("ClassMembership")
                                    .select("pupilId, classId, Classes(tag)").eq("pupilId", pupilId)
                                    .returns<{
                                        pupilId: number, 
                                        classId: number, 
                                        Classes: {
                                            tag: string
                                        }
                                    }[]>();

        if (error){
            throw new Error(error.message);
        }

        return data.map((c) => ({pupilid: c.pupilId, classId: c.classId, tag: c.Classes.tag}));

    } catch (error) {
        console.error(error);
        return [];
    }
} 


const Layout = async ({children, header, params} : {children: ReactNode, header: ReactNode, params: {pupilId: string}}) => {

    const {pupilId} = params;

    const classData = await loadClassesForPupil(pupilId);

    const papers = await loadPapersForClasses(classData.map((c) => c.classId))

    return <>
        <div className={styles.layout}>
        {header}
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} md={4}>
                <Paper className={styles.sidebar} elevation={0}>
                    <div>
                        <div>
                            <Link href={`/spec-items/${pupilId}`}>Home</Link>
                        </div>


                        {
                            classData.map((c, i) => <div key={i}>
                                <Link href={`/spec-items/${pupilId}/${c.classId}`}>{c.tag}</Link>
                            
                                {papers.filter((p) => p.classId == c.classId && p.markBy)
                                        .sort((a, b) => DateTime.fromISO(a.markBy).toJSDate() < DateTime.fromISO(b.markBy).toJSDate() ? 1 : -1)
                                        .map((p, i)=><div key={i} className={styles.paperLinks}>
                                            <div>
                                                <Link href={`/spec-items/${pupilId}/${p.classId}/${p.paperId}/enter-marks`}>{p.year}-{p.month}-{p.paper}</Link>
                                                &nbsp;(Mark By: {DateTime.fromISO(p.markBy).toISODate()})
                                             </div>
                                        </div>)}
                            </div>)
                        }

                        
                        
                    </div>
                </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
                {children}
            </Grid>
        </Grid>
        
        </div>
        
        </>
}

export default Layout;