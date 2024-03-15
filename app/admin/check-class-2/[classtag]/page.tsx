import { createSupabaseServerClient } from "app/utils/supabase/server";
import Link from "next/link";

import {Grid, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Select, MenuItem} from "@mui/material"
import { DateTime } from "luxon";
import styles from "./page.module.css";
import { getClassesForPupil } from "lib";

import Selector from "./class-selector";

const nullSort = (a: any, b: any, compareField: (a: any) => any, isAsc = true) => {

    const asc = isAsc ? 1 : -1;
    const desc = isAsc ? -1 : 1;

    if (compareField(a) == compareField(b)){
        return 0;
    }

    if (compareField(a) == null) {
        return isAsc ? asc : desc;
    }

    if (compareField(b) == null) {
        return isAsc ? desc  :asc;
    }

    return (compareField(a) > compareField(b) ? asc : desc)

}


const getClasses = async () => {
    const supabase = createSupabaseServerClient(false);

    if (!supabase){
        return {data: null, pupilsError: "Supabase not created"}
    }

    const {data: classes, error} = await supabase.from("Classes").select("tag");

    return {classes, classesError: error};

}

const getPupilsByTag = async(classtag: string) => {
    
    const supabase = createSupabaseServerClient(false);

    if (!supabase){
        return {data: null, pupilsError: "Supabase not created"}
    }

    const {data: pupils, error} = await supabase.from("vw_class_lists").select("tag, pupilId, firstName, familyName").eq("tag", classtag);

    console.log("Pupils", pupils);

    return {pupils, pupilsError: error};
}

const getPapersByTag = async(classtag: string) => {
    
    const supabase = createSupabaseServerClient(false);

    if (!supabase){
        return {data: null, pupilsError: "Supabase not created"}
    }

    const {data: papers, error} = await supabase.from("vw_papers_for_classes").select("paperId, tag, year, month, title, paperId, paper, availableFrom, completeBy, markBy").eq("tag", classtag);

    return {papers: papers?.sort((a, b) => nullSort(a, b, (x)=> x.markBy, false)).splice(0,7), papersError: error};
}

const getPupilMarksByTag = async(classtag: string) => {

    const supabase = createSupabaseServerClient(false);

    if (!supabase){
        return {data: null, pupilsError: "Supabase not created"}
    }

    // vw_marks_for_papers_by_tag
    const {data: pupilMarks, error: pupilMarkError} = await supabase.from("vw_marks_for_papers_by_tag").select("pupilId, paperId, tag, firstName, familyName, sum").eq("tag", classtag);

    return {pupilMarks, pupilMarkError: null};
}

const Page = async ({params} : {params: {classtag: string}}) => {

    const {classtag} = params;

    

    const {pupils, pupilsError} = await getPupilsByTag(classtag);
    const {papers, papersError} = await getPapersByTag(classtag);
    const {pupilMarks, pupilMarkError} = await getPupilMarksByTag(classtag);
    const {classes} = await getClasses();

    const getMarks = (pupilId: string, paperId: string, pupilMarks : {
        pupilId: any;
        paperId: any;
        tag: any;
        firstName: any;
        familyName: any;
        sum: any;
    }[] | null | undefined) => {

        if (!pupilMarks)
            return null;

        const result = pupilMarks.filter((pm) => pm.pupilId == pupilId && pm.paperId == paperId)

        if (result.length == 1){
            return result[0].sum
        }

        return null

    }

    return <div>
            <Link href={`/admin/check-class-2`}>Back</Link>
            <h1>Class Data for: <Selector classtag={classtag} classes={classes}/> 
            </h1>
            <hr/>

            <TableContainer component={Paper}>
           <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>Name</TableCell>
                    { papers?.map((p, i) => <TableCell key={i} >
                        <div>{p.year}-{p.month}-{p.paper}</div>
                        </TableCell>)
                        }
                    </TableRow>
                </TableHead>
                <TableHead>
                    <TableRow>
                    <TableCell>Mark by</TableCell>
                    { papers?.map((p, i) => <TableCell key={i} >
                        <div className={styles.displayDate}>{DateTime.fromISO(p.markBy, {zone: 'utc+3'}).toISODate() }</div>
                        </TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                   {
                    pupils?.map((p, i) => <TableRow key={i}>
                        
                        <TableCell >{p.firstName} {p.familyName}</TableCell>
                        {
                            papers?.map((paper, index) => <TableCell key={index}>{getMarks( p.pupilId, paper.paperId, pupilMarks)}</TableCell>)
                        }
                    
                    
                    </TableRow>)
                   }
                </TableBody>
            </Table>
            </TableContainer>

            
    </div>
}

export default Page;