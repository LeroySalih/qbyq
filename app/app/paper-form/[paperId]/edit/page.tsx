"use client"
import {useState, useEffect} from 'react';

import supabase from "app/utils/supabase/client";

import {Paper} from 'types/alias';


type PagePropsType = {
    params : {
     paperId: string
    } 
}

const EditPage = ({params}:PagePropsType) => {

    const [paper, setPaper] = useState<Paper | null>(null);
    const {paperId} = params;

    const loadPaper = async (paperId:number) => {

        
        if (paperId == 0){
            const {data, error} = await supabase.from("Papers")
                                                .insert({"title": "New Paper"})
                                                .select()
            
            error && console.error(error);
            // @ts-ignore
            setPaper(data);                                                
        } else {

            const {data, error} = await supabase.from("Papers")
                                            .select()
                                            .eq("id", paperId);

            error && console.error(error);

            // // console.log("Paper is", data);
            // @ts-ignore
            setPaper(data)
        }

        

        
    }


    useEffect(()=> {
        loadPaper(parseInt(paperId));
    }, [])

    return <>
        <h1>Editing Paper for {params.paperId}</h1>
        <pre>{JSON.stringify(paper, null, 2)}</pre>
    </>
}

export default EditPage;