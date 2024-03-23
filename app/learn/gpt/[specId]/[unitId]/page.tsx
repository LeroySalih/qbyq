import Link from "next/link";

import { createSupabaseServerClient } from "app/utils/supabase/server";
import styles from "./page.module.css";

import { DateTime } from "luxon";

import SpecSelector from "./unit-selector";
import {Select, MenuItem} from "@mui/material";

export const fetchCache = 'force-no-store';

type Answers = {
    code: any;
    created_at: any;
    owner: any;
    isCorrect: any;
}[] | null

type Item = {
    tag: string;
    title: string;
    code: string;
}


type Section = {
    title: string;
    items: Item[] | null;
}

type Sections = {
    [key: string] : Section;
}

type Link = {}
type Links = Link[] | null;

const Page = async ({params}: {params: {specId: number, unitId: number}}) => {

    const {specId, unitId} = params;

    const supabase = createSupabaseServerClient(false);

    if (!supabase){
        return <h1>Superbase not created</h1>
    }

    const {data: {user}} = await supabase.auth.getUser();

    if (!user){
        return <h1>No User: Please Sign In</h1>
    }

    const {data: specItems, error: specItemsError} = await supabase?.from("SpecItem").select("id, tag, title, Spec(id, title)").eq("specUnitId", unitId);

    specItemsError && console.error(specItemsError);

    if (specItems == null || specItems.length == 0){
        return <h1>No spec items found with a Unit Id {unitId}</h1>
    }

    //@ts-ignore
    const specs = specItems.reduce((prev, curr) => {prev[curr?.Spec?.id] = curr.Spec?.title; return prev}, {})

    console.log("Sepc Items", specItems);

    const {data, error} = await supabase?.from("dqPage").select("id, title, SpecItem!inner(tag, title, specUnitId)").eq("SpecItem.specUnitId", unitId);
     
    if( error) {
        return <h1>Error: no links returned</h1>
    }

    

    // Answers in the last 30 days.
    const {data: answers, error: answersError} = await supabase.from("dq_vw_answers ")  
                                .select("code, created_at, owner, isCorrect")
                                .gt("created_at", DateTime.now().minus({days: 30}).toISO())
                                .eq("owner", user.id)
                                ;
                                

    const sections = data.reduce((prev, cur) => { 
        // @ts-ignore
        if (!(cur.SpecItem?.tag in prev)) {

            // @ts-ignore
            prev[cur.SpecItem.tag] = {title: cur.SpecItem.title, items: []}
        }

        // @ts-ignore
        prev[cur.SpecItem.tag].items.push({tag: cur.SpecItem.tag, title: cur.title, code: cur.id})

        return prev;
    }, {})

    return <div className={styles.layout}>
    
        <SpecSelector specId={specId} unitId={unitId} />
        {data && data.length == 0 && <div>No links found</div>}
        <DisplayLinks sections={sections} answers={answers}/>        
        
        </div>
}

export default Page;


const getAnswerData = (code: string, answers: Answers) => {

    const codeAnswers = answers?.filter(a => a.code == code) || []; 

    const day30Correct = codeAnswers.filter(a => a.isCorrect).length;
    const day30Incorrect = codeAnswers.filter(a => a.isCorrect == false).length;
    const todayAnswers = codeAnswers.filter(a => a.created_at > DateTime.now().startOf('day').toISO()) || [];
    const todayCorrect = todayAnswers.filter(a => a.isCorrect).length;
    const todayIncorrect = todayAnswers.filter(a => a.isCorrect == false).length;;

    return <div key={code} className={styles.answerGrid}>
            <div className={styles.todayCorrect}>{todayCorrect > 0 ? todayCorrect : <span>&nbsp;</span>}</div>
            <div>&nbsp;|&nbsp;</div>
            <div className={styles.todayIncorrect}>{todayIncorrect > 0 ? todayIncorrect : <span>&nbsp;</span>}</div>
            <div>&nbsp;|&nbsp;</div>
            <div className={styles.allCorrect}>{day30Correct > 0 ? day30Correct : <span>&nbsp;</span>}</div>
            <div>&nbsp;|&nbsp;</div>
            <div className={styles.allIncorrect}>{day30Incorrect > 0 ? day30Incorrect : <span>&nbsp;</span>}</div>
            </div>
}



const DisplayLinks = ({sections, answers} : {sections: Sections, answers: Answers})=> {

    if (!sections)
    {
        return <div>Loading</div>
    }

    return <>
        {
            sections && Object.keys(sections).map((k: string, i: number) => <div className={styles.section} key={i}>
                <div className={styles.sectionTitle}>{k} - {sections[k].title}</div>
                {sections && sections[k]?.items?.map((item:Item, index: number) => <>
                    <div className={styles.displayLinks}>
                        <Link href={`/learn/gpt/pages/${item.code}`}>{item.title}</Link>
                        <DisplayAnswers code={item.code} answers={answers} />
                    </div>
                </>)}
            </div>)  
        }
        
    </>

}


const DisplayAnswers = ({code, answers}: {code: string, answers : Answers}) =>{
    const codeAnswers = answers?.filter(a => a.code == code) || []; 

    const day30Correct = codeAnswers.filter(a => a.isCorrect).length;
    const day30Incorrect = codeAnswers.filter(a => a.isCorrect == false).length;
    const todayAnswers = codeAnswers.filter(a => a.created_at > DateTime.now().startOf('day').toISO()) || [];
    const todayCorrect = todayAnswers.filter(a => a.isCorrect).length;
    const todayIncorrect = todayAnswers.filter(a => a.isCorrect == false).length;;

    return <div key={code} className={styles.answerGrid}>
            <div className={styles.todayCorrect}>{todayCorrect > 0 ? todayCorrect : <span>&nbsp;</span>}</div>
            <div className={styles.spacer}>&nbsp;:&nbsp;</div>
            <div className={styles.todayIncorrect}>{todayIncorrect > 0 ? todayIncorrect : <span>&nbsp;</span>}</div>
            <div className={styles.spacer}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <div className={styles.allCorrect}>{day30Correct > 0 ? day30Correct : <span>&nbsp;</span>}</div>
            <div className={styles.spacer}>&nbsp;:&nbsp;</div>
            <div className={styles.allIncorrect}>{day30Incorrect > 0 ? day30Incorrect : <span>&nbsp;</span>}</div>
            </div>
}