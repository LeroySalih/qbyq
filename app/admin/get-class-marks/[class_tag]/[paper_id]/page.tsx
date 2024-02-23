"use client"

import supabase from 'components/supabase';
import { useEffect, useState } from 'react';
import styles from "./page.module.css";

type PageParams = {
    params : {class_tag : string, paper_id: number}
}

type DataType = { 
    classid: number; classtag: string; pupilid: string; first_name: string; family_name: string; marks: number; 
}[]

const Page = ({params} : PageParams ) => {

    const {class_tag, paper_id} = params;
    const [data, setData] = useState< DataType | null>(null);

    const loadData = async (class_tag: string, paper_id: number) => {

        const {data, error} = await supabase.rpc("get_class_marks", {class_tag, paper_id});

        error && console.error(error);

        setData((data as unknown) as DataType);

    }

    useEffect ( ()=> {
        loadData(class_tag, paper_id);
    }, [])

    return <>
                <div className={styles.page}>
                <h1>Get Class Marks for {class_tag} and {paper_id}</h1>
                <div className={styles.displayClassMarks}>
                {
                    data && data?.sort((a, b) => a.marks > b.marks ? 1 : -1)
                            .map((row, index) => [
                    <div key={index}>{row.first_name}</div>, 
                    <div key={index}>{row.family_name}</div>, 
                    <div key={index}>{row.marks}</div>,
                ])
                }
                </div>
                </div>
            </>
}


export default Page;