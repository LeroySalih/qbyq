
"use client";

import Card from "components/card";
import styles from './display-spec-data-by-item.module.css';

import supabase from "app/utils/supabase/client";

import {useState, useEffect, useMemo} from 'react';
import {GetPupilMarksBySpecItem} from 'types/alias';
import DataGrid, {textEditor, Column} from 'react-data-grid';

interface SummaryRow {
    id: string;
    totalCount: number;
    pMarksTotal: number, 
    aMarksTotal: number,
    paperAverage: string;
  }


export interface Row {
    specTag : string,
    specItem : string,
    revisionMaterials : string | null,
    pMarks : number, 
    aMarks : number,
    pct: string,
   // fcScore : number | string
  }

const renderFCScore = ({row}: {row : Row})  => {
    
    const value = "0"; //row.fcScore;

    // if (value === 'Add')
    //    return <span style={{color: "blue", cursor: "pointer"}} >Add</span>

    return (
      <>
        <progress max={100} value={value} style={{ inlineSize: 50 }} /> {Math.round(value as unknown as number)}%
      </>
    );
  }

  const renderSpecItem = ({row}: {row : Row})  => {


    return (row.revisionMaterials) ? <a href={row.revisionMaterials}>{row.specItem}</a> : row.specItem;
    
  }

  const renderPaperAverageSummary = ({row} :  {row:SummaryRow}) => {
    console.log('Row', row)
    return `${row.paperAverage}%`;
  }

const DisplaySpecDataByItem = ({pupilId, specId, classId}: {pupilId: string, specId: number, classId: number}) => {

    const [data, setData] = useState<GetPupilMarksBySpecItem | null>(null);
    const columns : readonly Column<Row>[]= [
        {key: 'specTag',name: 'Tag', width: 40},
        {key: 'specItem',name: 'Item', resizable: true, 
            renderCell: renderSpecItem, 
            renderSummaryCell () {
            return <strong>Total</strong>;
          }},
        {key: 'pMarks', name: 'Actual', width: 80, 
          // @ts-ignore
            renderSummaryCell(props: {row: SummaryRow}) {
              return props.row.pMarksTotal
          },
        },
        {key: 'aMarks',name: 'Available', width: 80,
          // @ts-ignore
          renderSummaryCell(props: {row: SummaryRow}) {
              return props.row.aMarksTotal
          },
        },
        {
            key: 'pct',
            name: '%', 
            width: 80, 
            //@ts-ignore
            renderSummaryCell : renderPaperAverageSummary,
        },
        // {key: 'fcScore', name: 'FC Overdue', width: 120, renderCell: renderFCScore },
        

    ]

    
    const loadData = async (pupilId: string, specId: number, classid: number) => {

        const {data, error} = await supabase.rpc("fn_pupil_marks_by_spec_item", {userid: pupilId, specid: specId, classid});

        error && console.error(error);

        //@ts-ignore
        setData(data);
    }

    useEffect(()=> {
        loadData(pupilId, specId, classId);
    }, [pupilId, specId, classId]);
    

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

    const summaryRows = useMemo((): readonly SummaryRow[] => {
        if (!data)
            return [{id: 'total_0', totalCount: 0, pMarksTotal: 0, aMarksTotal: 0, paperAverage: "0"}];

        const {aMarksTotal, pMarksTotal } = data.reduce((prev, curr) => ({aMarksTotal: prev.aMarksTotal + curr.aMarks, pMarksTotal: prev.pMarksTotal + curr.pMarks, }), {aMarksTotal: 0, pMarksTotal: 0})
        return [
          {
            id: 'total_0',
            totalCount: data ? data.length : 0,
            pMarksTotal,
            aMarksTotal,
            paperAverage: (( pMarksTotal / aMarksTotal) * 100).toFixed(0)
          }
        ];
      }, [data]);


    return <>
        <Card title="Spec Items">
            <div style={{height: '80vh'}}>
        {data && <DataGrid 
            topSummaryRows={summaryRows}
            rowKeyGetter={rowKeyGetter}
            columns={columns} 
            className={styles.fillGrid}
            rows={data.map((r) => (
                    {...r, ['pct']: r.aMarks == 0 ? "0" : ((r.pMarks / r.aMarks) * 100).toFixed(0) as string, 
                     //'fcScore' : 0,
                    
                })
            )}/>}
            
            </div>
        </Card>
    </>
}

export default DisplaySpecDataByItem; 
