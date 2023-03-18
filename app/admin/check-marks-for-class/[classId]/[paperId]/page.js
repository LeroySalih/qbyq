"use client"

import {useEffect, useState} from 'react';

import supabase from 'components/supabase';

const CheckMarksForClass = ({params}) => {

    const {classId, paperId} = params
    const [data, setData] = useState(null);

    const loadData = async (classId, paperId) => {

        const {data, error} = await supabase.rpc('fn_check_paper_for_class', {
            classid: parseInt(classId), 
            paperid: parseInt(paperId)
            });

          // Searched for the function public.fn_check_paper_for_class without parameters or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache.

        error && console.error(error);
        console.log("Data", data);
        setData(data);
    }


    useEffect( ()=> {

        loadData(classId, paperId);

    }, [])



    return <><h1>Showing Data for: Class {classId} :: Paper {paperId}</h1>
    
        <div className="display-grid">
            {data && data
                .sort((a, b) => a.pMarks > b.pMarks ? 1 : -1)
                .map((d, i) => 
                [
                <div key={`1${d.pupilId}`}>{d.firstName}</div>,
                <div key={`2${d.pupilId}`}>{d.familyName}</div>,
                <div key={`3${d.pupilId}`}>{d.pMarks}</div>
                ]
                )}
        </div>
        
        <style jsx="true">{`
            .display-grid {
                display: grid;
                grid-template-columns : 1fr 1fr 1fr;
            }
        `}</style>
    </>
}


export default CheckMarksForClass;