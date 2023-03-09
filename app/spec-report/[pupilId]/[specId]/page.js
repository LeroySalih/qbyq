"use client";

import supabase from 'components/supabase';
import { useEffect, useState } from 'react';

const SpecReport = ({params}) => {
    const {pupilId, specId} = params
    return <>
        <h1>Spec Report for {pupilId}, {specId}</h1>
        <hr></hr>
        <div className="display">
        <div><DisplaySpecDataByItem pupilId={pupilId} specId={specId}/></div>
        <div><DisplaySpecDataByMarks pupilId={pupilId} specId={specId}/></div>
        </div>
        <div></div>
        <style jsx="true">{`
        
            .display {
                display: grid;
                grid-template-columns: 2fr 1fr;
            }

        `}</style>
    </>
}


export default SpecReport;



const DisplaySpecDataByItem = ({pupilId, specId}) => {


    const [specData, setSpecData] = useState(null);

    const loadData = async () => {

        const {data, error} = await supabase.rpc("fn_pupil_marks_by_spec_item", {userid: pupilId, specid: specId});

        error && console.error(error);

        console.log(data);

        setSpecData(data)
    }

    useEffect(()=> {

        loadData();

    }, [])

    const footer = () => {

        if (!specData) return <div></div>
        
        const result = specData.reduce((c, p) => ({pMarks: p.pMarks + c.pMarks, aMarks: p.aMarks + c.aMarks }), {pMarks:0, aMarks: 0})
       
        return <>
                <div></div>
                <div>Total</div>
                <div>{result.pMarks}</div>
                <div>{result.aMarks}</div>
                <div>{((result.pMarks / result.aMarks) * 100).toFixed(0)}%</div>
            </>
    }

    return <>
        <div>Data for pupil {pupilId}</div>
        <div className="specItemGrid">
            {specData && specData.map((s,i) => <>
                <div>{s.specTag}</div>
                <div>{s.specItem}</div>
                <div>{s.pMarks}</div>
                <div>{s.aMarks}</div>
                <div>{((s.pMarks / s.aMarks) * 100).toFixed(0)}%</div>
            </>)}
            { footer() }
        </div>

        
       
        <style jsx="true">{`
        
            .specItemGrid {
                display : grid;

                grid-template-columns: 1fr 4fr 1fr 1fr 1fr;
            }



            `}
        </style>
    </>
}

const DisplaySpecDataByMarks = ({pupilId, specId}) => {

    const [specData, setSpecData] = useState(null);

    const loadData = async () => {

        const {data, error} = await supabase.rpc("fn_pupil_marks_by_available_marks", {userid: pupilId, specid: specId});

        error && console.error(error);

        console.log(data);

        setSpecData(data)
    }

    useEffect(()=> {

        loadData();

    }, [])

    const footer = () => {

        if (!specData) return <div></div>
        
        const result = specData.reduce((c, p) => ({pMarks: p.pMarks + c.pMarks, aMarks: p.aMarks + c.aMarks }), {pMarks:0, aMarks: 0})
       
        return <>
                    <div class="footer">Total</div>
                    <div class="footer">{result.pMarks}</div>
                    <div class="footer">{result.aMarks}</div>
                    <div class="footer">{((result.pMarks / result.aMarks) * 100).toFixed(0)}%</div>
                </>
       

    }

    return <><div>Data for pupil by marks</div>
        <div className="specItemGrid">
            {specData && specData.map((s, i) => <>
            <div>{s.avMarks}</div>
            <div>{s.pMarks}</div>
            <div>{s.aMarks}</div>
            <div>{((s.pMarks / s.aMarks) * 100).toFixed(0)}%</div>
            
            </>
            )}

            {footer()}
        </div>
        
        
        
        <style jsx="true">{`
        
            .specItemGrid {
                display : grid;

                grid-template-columns: repeat(4, 1fr);
            }

            .footer {
                border-top : double 1px silver
                text-weight: 
            }



            `}
        </style>
    </>
}