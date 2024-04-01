"use client"


import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {ClassPaper, ClassPapers} from "./types";
import Link from 'next/link';
import {DateTime} from 'luxon';
import styles from "./papers-grid.module.css";


const PapersGrid = ({classPapers, pupilId} : {classPapers : ClassPapers, pupilId: string}) => {
    
    const columns: GridColDef<ClassPapers>[] = [
        { field: 'id', headerName: 'ID', width: 50},
        { field: 'classTag', headerName: 'Class', width: 80 },
        { field: 'paperTitle', headerName: 'Paper', width: 250, 
            renderCell: (params: GridRenderCellParams<any, Date>) => (<Link href={`/spec-items/${pupilId}/${params.row.classId}/${params.row.paperId}/enter-marks`}>{params.row.paperTitle}</Link>),
            //@ts-ignore
            valueGetter: (value, row) => `${row.year}-${row.month}-${row.paper}`},
      //  { field: 'availableFrom', headerName: 'Available From', valueGetter: (value: string, row) => `${value && value.substring(5, 10)}`},
      //  { field: 'completeBy', headerName: 'Complete By', valueGetter: (value: string, row) => `${value && value.substring(5, 10)}`},
        { field: 'markBy', headerName: 'Mark By', width: 100, valueGetter: (value: string, row) => `${value && value.substring(5, 10)}`},
        { field: 'status', headerName: 'Status', width: 100, 
           valueGetter: (value: string, rows) => formatOpen(rows), 
           renderCell: (params: GridRenderCellParams<any, Date>) => displayStatus(params),
            
        }, 
        {field: 'pupilMarks', headerName: 'Pupil Marks'},
        {field: 'paperMarks', headerName: 'Paper Marks'}
      ];

    const displayStatus = (params: GridRenderCellParams<any, Date>) => {
      return <div className={styles[formatOpen(params.row)]}>{formatOpen(params.row)}</div>
    };

    const formatOpen = (row: ClassPaper) =>{
      const today = DateTime.now().toISODate();

      if (row.availableFrom <= today && today <= row.markBy && !row.pupilMarks) {
        return "Late"
      }
      
      if (row.availableFrom <= today && today <= row.markBy) {
        return "Open"
      }

      if (row.markBy <= today){
        return "Closed"
      }

      return "Unknown";
    }
    
    return <DataGrid
    /* @ts-expect-error */
    rows={classPapers.map((r) => ({...r, id: `${r.classId}-${r.paperId}`}))}
    
    /* @ts-expect-error */
    columns={columns}
    
    initialState={{
        columns: {
            columnVisibilityModel: {
              // Hide columns status and traderName, the other columns will remain visible
              id: false,
              
            },
          },
        sorting: {
            sortModel: [{ field: 'markBy', sort: 'desc' }],
        },
      pagination: {
        paginationModel: {
          pageSize: 20,
        },
      },
    }}
    pageSizeOptions={[5]}
    
    disableRowSelectionOnClick
  />
}

export default PapersGrid;
