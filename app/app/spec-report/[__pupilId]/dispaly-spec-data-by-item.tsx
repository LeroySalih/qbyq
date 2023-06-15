
"use client";

import Card from "components/card";
import styles from './display-spec-data-by-item.module.css';

import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {headers, cookies} from 'next/headers';
import Link from "next/link";
import { useSupabase } from "components/context/supabase-context";
import {useState, useEffect} from 'react';
import { setDatasets } from "react-chartjs-2/dist/utils";
import {GetPupilMarksBySpecItem} from 'types/alias';
import DataGrid, {textEditor, Column} from 'react-data-grid';

export interface Row {
    specTag : string,
    specItem : string,
    revisionMaterials : string | null,
    pMarks : number, 
    qMarks : number,
    pct: number,
    fcScore : number | string
  }

const renderFCScore = ({row}: {row : Row})  => {
    
    const value = row.fcScore;

    if (value === 'Add')
        return <span style={{color: "blue", cursor: "pointer"}} >Add</span>
    return (
      <>
        <progress max={100} value={value} style={{ inlineSize: 50 }} /> {Math.round(value)}%
      </>
    );
  }

  const renderSpecItem = ({row}: {row : Row})  => {


    return (row.revisionMaterials) ? <a href={row.revisionMaterials}>{row.specItem}</a> : row.specItem;
    
  }

const DisplaySpecDataByItem = ({pupilId, specId}: {pupilId: string, specId: number}) => {

    const {supabase} = useSupabase();
    const [data, setData] = useState<GetPupilMarksBySpecItem | null>(null);
    const columns : readonly Column<Row>[]= [
        {key: 'specTag',name: 'Tag', width: 40},
        {key: 'specItem',name: 'Item', resizable: true, renderCell: renderSpecItem},
        {key: 'pMarks', name: 'Actual', width: 80},
        {key: 'aMarks',name: 'Available', width: 80},
        {key: 'pct',name: '%', width: 80},
        {key: 'fcScore', name: 'FC Overdue', width: 120,
        renderCell: renderFCScore },
        

    ]

    
    const loadData = async (pupilId: string, specId: number) => {

        const {data, error} = await supabase.rpc("fn_pupil_marks_by_spec_item", {userid: pupilId, specid: specId});

        error && console.error(error);

        //@ts-ignore
        setData(data);
    }

    useEffect(()=> {
        loadData(pupilId, specId);
    }, [pupilId, specId]);
    

    function rowKeyGetter(row: Row) {
        return row.specTag;
      }
    
    const footer = () => {

        if (!data) return <div></div>
        
        const result = data.reduce((c, p) => ({pMarks: p.pMarks + c.pMarks, aMarks: p.aMarks + c.aMarks }), {pMarks:0, aMarks: 0})
       

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
        {data && <DataGrid 
            rowKeyGetter={rowKeyGetter}
            columns={columns} 
            rows={data.map((r) => (
                    {...r, ['pct']: ((r.pMarks / r.aMarks) * 100).toFixed(0), 
                    'fcScore' : (Math.random() > 0.5 ) ? (Math.random() *  100) : "Add",
                    
                })
            )}/>}
            {
            <div className={styles.specItemGrid}>
                    <div>Tag</div>
                    <div>Item</div>
                    <div>Your Marks</div>
                    <div>Available Marks</div>
                    <div>%</div>

                {data && data.map((s,i) => [
                    <div key={`1${i}`}>{s.specTag}</div>,
                    
                    <div key={`2${i}`}>{(s.revisionMaterials !== null) ? <Link href={`${s.revisionMaterials}`}>{s.specItem}</Link> : <span>{s.specItem}</span>}</div>,
                    <div key={`3${i}`}>{s.pMarks}</div>,
                    <div key={`4${i}`}>{s.aMarks}</div>,
                    <div key={`5${i}`}>{((s.pMarks / s.aMarks) * 100).toFixed(0)}%</div>
                ])}
                { footer() }
            </div>
                
                }
        </Card>
    </>
}

export default DisplaySpecDataByItem;
