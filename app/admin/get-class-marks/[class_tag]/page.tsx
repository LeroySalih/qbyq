"use client"

import supabase from 'app/utils/supabase/client';
import { useEffect, useState } from 'react';
import styles from "./page.module.css";
import Link from 'next/link'

type PapersData = {
    classId: number;
    paperId: number;
    year: string;
    month: string;
    title: string;
    paper: string;
}[]


const Page = ({params} : {params: {class_tag : string}}) => {

    const {class_tag} = params;
    const [data, setData] = useState<PapersData | null>(null);

    const loadData = async (class_tag : string) => {

        const {data, error} = await supabase.rpc('get_papers_class_tag', {
          class_tag
        })
        
        error && console.error(error);
        
        setData(((data as unknown) as PapersData));
    }

    useEffect(()=> {
        loadData(class_tag);
    }, [])

    return <><h1>Papers for Class</h1>
        <div className={styles.displayPapers}>
        {
            data && data.map((paper, index) => <div key={index}>
                <Link href={`/admin/get-class-marks/${class_tag}/${paper.paperId}`}> {paper.year}-{paper.month}-{paper.paper}</Link>
                </div>)
        }
        </div>
        
    </>
}


export default Page;