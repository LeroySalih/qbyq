"use client";

import supabase from 'components/supabase';
import { useEffect, useState, useContext } from 'react';
import { UserContextType, UserContext } from 'components/context/user-context';
import Link from 'next/link';
import Chart from 'components/line-chart';

  
  

const SpecReport = ({params}) => {
    const {pupilId, specId} = params;
    const {user, profile, classes, pupilMarks, loadClasses} = useContext(UserContext);

    return <>
        <h1>Spec Report for {profile && `${profile.firstName} ${profile.familyName}`}</h1>
        <hr></hr>
        <div className="display">
        <div style={{gridArea:"a"}}>
            <DisplaySpecProgress pupilId={pupilId} specId={specId}/>
        </div>
        <div style={{gridArea:"c"}}><DisplaySpecDataByMarks pupilId={pupilId} specId={specId}/></div>
        <div style={{gridArea:"b"}}><DisplaySpecDataByItem pupilId={pupilId} specId={specId}/></div>
        
        </div>
        <div></div>
        <style jsx="true">{`
        
            .display {
                display: grid;
                grid-template-columns: 1fr 2fr;
                grid-template-areas : "a b" "c b"
            }

        `}</style>
    </>
}


export default SpecReport;



const DisplaySpecProgress = ({pupilId, specId}) => {

    const [specData, setSpecData] = useState(null);

    const loadData = async () => {
        const {data, error} = await supabase.rpc('fn_pupil_marks_by_available_from_date', { specid: specId, uuid: pupilId});

        error && console.error(error);
        console.log("byDate", data);
        setSpecData(data.map(d => ({availableFrom: d.availablefrom, pMarks: d.pmarks, aMarks: d.amarks, pct: (d.pmarks / d.amarks)})));
    }
    useEffect(()=> {
        loadData();
    }, []);

    // fn_pupil_marks_by_paper 
    return <Card title="Progess">
        {specData && <Chart labels={specData.map(s => s.availableFrom)} data={specData.map(s => (s.pct * 100))}/>}
        
    </Card>
}


const DisplaySpecDataByItem = ({pupilId, specId}) => {


    const [specData, setSpecData] = useState(null);

    const loadData = async () => {

        const {data, error} = await supabase.rpc("fn_pupil_marks_by_spec_item", {userid: pupilId, specid: specId});

        error && console.error(error);

        console.log("SpecData", data);

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
        <Card title="Spec Items">
            <div className="specItemGrid">
                    <div>Tag</div>
                    <div>Item</div>
                    <div>Your Marks</div>
                    <div>Available Marks</div>
                    <div>%</div>

                {specData && specData.map((s,i) => <>
                    <div>{s.specTag}</div>
                    
                    <div>{(s.revisionMaterials !== null) ? <Link href={`${s.revisionMaterials}`}>{s.specItem}</Link> : <span>{s.specItem}</span>}</div>
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
        </Card>
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
                    <div className="footer">Total</div>
                    <div className="footer">{result.pMarks}</div>
                    <div className="footer">{result.aMarks}</div>
                    <div className="footer">{((result.pMarks / result.aMarks) * 100).toFixed(0)}%</div>
               </>
    }

    return <>
        <Card title="Question Type">
            <div className="specItemGrid">
                <div>Question Type</div>
                <div>Your Marks</div>
                <div>Available Marks</div>
                <div>%</div>

                {specData && specData.map((s, i) => <>
                <div key={`1${i}`}>{s.avMarks}</div>
                <div key={`2${i}`}>{s.pMarks}</div>
                <div key={`3${i}`}>{s.aMarks}</div>
                <div key={`4${i}`}>{((s.pMarks / s.aMarks) * 100).toFixed(0)}%</div>
                
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
        </Card>
       
    </>
}

const Card = ({children, title}) => {

    return <>
    <div className="card">
    <div className="title">{title}</div>
    <div className="body">
        {children}
    </div>
    
    
    
    </div>
    <style jsx="true">{`
    
        .card{
            background-color: white;
            border : silver 1px solid;
            border-radius: 0.5rem;
            box-shadow: 0px 0px 20px #80808080;
            margin: 3rem;
            margin-top : 0.5rem;
        }

        .card .title {
            background-color : #f0f0f0;
            margin: 0px;
            
            padding: 0px;
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
            padding: 1rem;
            padding-bottom: 0.5;
        }

        .card .body {
            padding: 1rem;
            padding-top: 0.5rem;
            font-size: 0.8rem;
        }



        `}
    </style>
</>
}