"use client"
import { useEffect, useState, useMemo} from "react";

import { useSupabase } from "components/context/supabase-context";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {Database} from "types/supabase";
import {AdminGetPapersForClass} from "types/alias";

import 'react-data-grid/lib/styles.css';
import DataGrid, {textEditor, Column} from 'react-data-grid';

import {DateTime} from 'luxon';

interface Classes {
    id: number, 
    tag: string, 
    title: string,
    specId: number 
}

interface Row {
    paperId: string,
    year: string, 
    month: string,
    paper: string,
    subject: string,
    avaiablefrom: string,
    compelteby: string,
    markby: string
}

type Comparator = (a: Row, b: Row) => number;


function getComparator(sortColumn: string): Comparator {
    switch (sortColumn) {
      
      case 'availableFrom':
        return (a, b) => {
          //@ts-ignore
          return a[sortColumn].localeCompare(b[sortColumn]);
        };
      default:
        throw new Error(`unsupported sortColumn: "${sortColumn}"`);
    }
  }

  export type SortDirection = 'ASC' | 'DESC';

  export interface SortColumn {
    readonly columnKey: string;
    readonly direction: SortDirection;
  }

const Page = () => {

    const {supabase} = useSupabase();
    const [classes, setClasses] = useState<Database["public"]["Tables"]["Classes"]["Row"][] | null>(null);
    const [classId, setClassId] = useState<number>(0);
    const [classPapers, setClassPapers] = useState<AdminGetPapersForClass[] | null>(null);
    const [allPapers, setAllPapers] = useState<Database["public"]["Tables"]["Papers"]["Row"][] | null> (null);

    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

    const renderDate = ({column, row}: any) => {
        return DateTime.fromISO(row[column.key]).toISODate();
    }

    

    const columns = [
        {key: 'paperId', name: 'paperId'},
        {key: 'year', name: 'Year'},
        {key: 'month', name: 'Month'},
        {key: 'paper', name: 'Paper'},
        {key: 'subject', name: 'Subject'},
        {key: 'availableFrom', name: "Available From", renderCell: renderDate, renderEditCell: textEditor},
        {key: 'completeBy', name: "Complete By", renderCell: renderDate, renderEditCell: textEditor},
        {key: 'markBy', name: "Mark By", renderCell: renderDate, renderEditCell: textEditor},


    ]

    const loadClasses = async () => {
        const {data, error} = await supabase.from("Classes").select().order("tag");

        error && console.error(error);

        setClasses(data);
        data && data.length > 0 && setClassId(data[0].id); 
    } 


    const loadClassPapers = async (_classid: number) => {
        const {data, error} = await supabase.rpc("fn_admin_get_papers_for_class", {_classid});

        error && console.error(error);

        setClassPapers(data);
    }





    useEffect(()=>{

        loadClasses();

    }, []);


    useEffect(()=> {

        if (!classId)
            return;
    
        loadClassPapers(classId);

    }, [classId]);


    const rowKeyGetter = (row: any) => {
        return row.paperId;
    }

    const handleRowsChange = async (rows: any, data : any) => {
        console.log(rows, data);
        const {indexes, column} = data 
        

        console.log("Upserting ClassPapers",  {classId, paperId: rows[indexes[0]].paperId, [column.key]: rows[indexes[0]][column.key]});

        const {data:upsertData, error} = await supabase.from("ClassPapers")
                    .upsert({classId, paperId: rows[indexes[0]].paperId, [column.key]: rows[indexes[0]][column.key]})
                    .select();

        error && console.error(error);
        console.log("Upsert Result", upsertData);
        if (!upsertData){
            setClassPapers(rows);
        } else {
            const tmpRows = rows.map((r:any) => {
                if (r.paperId != upsertData[0].paperId)
                    return r
                else 
                    return {...r, 
                        avalaibleFrom: upsertData[0].availableFrom, 
                        completeBy: upsertData[0].completeBy,
                        markBy: upsertData[0].markBy
                    }
            });
    
            setClassPapers(tmpRows);
        }
        
    }


    return <div>
    <h1>Assigning Papers to Class</h1>
    {classId > 0 && <Select value={classId} onChange={(e)=> { setClassId(e.target.value as number)}}>
        {classes && classes.map((c, i) => <MenuItem key={i} value={c.id}>{c.tag}</MenuItem>)}
    </Select>}
    {classPapers && classPapers.length == 0 && <h1>No Papers Found</h1>}

    {classPapers && classPapers.length > 0 && <DataGrid 
        
        rowKeyGetter={rowKeyGetter}
        onSelectedRowsChange={console.log}
        onRowsChange={handleRowsChange}
        columns={columns} 
        rows={classPapers}

        sortColumns={sortColumns}
        onSortColumnsChange={setSortColumns}

        />}
   
   
    </div>
}

export default Page;