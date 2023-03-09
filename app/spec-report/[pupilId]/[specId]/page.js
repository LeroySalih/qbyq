"use client";

import supabase from 'components/supabase';
import { useEffect, useState } from 'react';

const SpecReport = ({params}) => {
    const {pupilId, specId} = params
    return <>
        <h1>Spec Report for {pupilId}, {specId}</h1>
        <hr></hr>
        <div><DisplaySpecDataByItem pupilId={pupilId}/></div>
        <div><DisplaySpecDataByMarks pupilId={pupilId}/></div>
        <div></div>
    </>
}


export default SpecReport;



const DisplaySpecDataByItem = ({pupilId}) => {


    const [specData, setSpecData] = useState(null);

    const loadData = async () => {

        const {data, error} = await supabase.rpc("fn_pupil_marks_by_spec_item", {userid: '973b72e6-ffa4-421c-92f7-2a760d374748', specid: 1});

        error && console.error(error);

        console.log(data);

        setSpecData(data)
    }

    useEffect(()=> {

        loadData();

    }, [])

    return <>
        <div>Data for pupil {pupilId}</div>
        <div className="specItemGrid">
            {specData && specData.map((s,i) => <>
                <div>{s.specTag}</div>
                <div>{s.specItem}</div>
                <div>{s.pMarks}</div>
                <div>{s.aMarks}</div>
            </>)}
        </div>
       
        <style jsx="true">{`
        
            .specItemGrid {
                display : grid;

                grid-template-columns: repeat(4, 1fr);
            }



            `}
        </style>
    </>
}

const DisplaySpecDataByMarks = ({pupilId}) => {

    const [specData, setSpecData] = useState(null);

    const loadData = async () => {

        const {data, error} = await supabase.rpc("fn_pupil_marks_by_available_marks", {userid: '973b72e6-ffa4-421c-92f7-2a760d374748', specid: 1});

        error && console.error(error);

        console.log(data);

        setSpecData(data)
    }

    useEffect(()=> {

        loadData();

    }, [])

    return <div>Data for pupil by marks {JSON.stringify(specData, null, 2)}</div>
}