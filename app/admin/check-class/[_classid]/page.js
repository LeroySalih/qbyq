"use client"
import supabase from 'components/supabase';
import {useState, useEffect, useMemo} from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid, {textEditor} from 'react-data-grid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const CheckClass = ({params}) => {

    const {_classid} = params;
    
    const [classid, setClassId] = useState(_classid);
    const [paperMarks, setPaperMarks] = useState(null);
    const [papersForClass, setPapersForClass] = useState(null);
    const [classDetails, setClassDetails] = useState(null);
    const [classes, setClasses] = useState(null);

    const shapePapers = (papers) => {

        return (!papers || papers.length == 0) ? [] : [
            {
                key:"name", 
                name:"Name", 
                width: 320,
                resizable: true,
                frozen: true,
                summaryFormatter : ({row}) => {return <strong>Complete By:</strong>}
            }, 
            ...(papers.map((p, i) => ({
                key: p.paperId, 
                width: 160,
                name: `${p.Papers.year}-${p.Papers.month}-${p.Papers.paper}`,
                availableFrom: p.availableFrom,
                completeBy: p.completeBy,
                summaryFormatter : ({column}) => {return <strong>{column.completeBy?.substr(0, 10)}</strong>}
                }
                

                )))
            ]
    }

    const shapePaperMarks = (paperMarks) => {

        return Object.values(paperMarks.reduce((prev, curr) => {
            if (!prev[curr.pupilId]){
                prev[curr.pupilId] = {pupilId: curr.pupilId, firstName: curr.firstName, familyName: curr.familyName};
            }
            
            prev[curr.pupilId][curr.paperId] = curr.pMarks;
            prev[curr.pupilId].name = curr.firstName + " " + curr.familyName;

            return prev;
        }, {})
        );

    }

    const loadClassDetails = async (classid) => {
        const {data, error} = await supabase.from("Classes").select("tag,title").eq("id", classid);

        error && console.error(error);

        setClassDetails(data[0]);
    }

    const loadPapersForClass = async (classid) => {
        const {data, error} =await supabase.from("ClassPapers")
                        .select("paperId, availableFrom, completeBy, Papers(year, month, paper)")
                        .eq("classId", classid)
                        .order("availableFrom", {ascending: false});
  
          error && console.error(error);
  
          setPapersForClass(shapePapers(data));
    } 

    const loadClassData = async (classid) => {
        const {data, error} =await supabase.rpc('fn_check_class', {
          classid
        })

        error && console.error(error);

        setPaperMarks(shapePaperMarks(data));
    } 

    const loadAllClasses = async () => {
        const {data, error} = await supabase.from("Classes").select().neq("id", 0);

        error && console.error(error);

        setClasses(data);
    }

    useEffect(()=> {
        loadAllClasses();
        setClassId(_classid);
    },[_classid]);

    useEffect(()=> {
        loadClassData(classid);
        loadPapersForClass(classid);
        loadClassDetails(classid);
        }, [classid]
    );

    const summaryRows = useMemo(() => {
        // console.log('pfc', papersForClass)
        const summaryRow = {
          count: papersForClass?.length
        };
        return [summaryRow];
      }, [papersForClass]);

    return <>
            <h1>Listing Papers for Class 
            
                <Select value={classid} onChange={(e) => setClassId(e.target.value)}>
                    {classes && classes.map((c, i) => <MenuItem key={i} value={c.id}>{c.tag}</MenuItem>)}
                </Select>
                
            </h1>
           {paperMarks && papersForClass && <DataGrid 
            columns={papersForClass} 
            rows={paperMarks} 
            topSummaryRows={summaryRows}
            />}
            
            
        </>
}


export default CheckClass;