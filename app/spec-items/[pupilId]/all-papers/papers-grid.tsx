"use client"


import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {ClassPaper, ClassPapers} from "./types";
import Link from 'next/link';


/*

const columns: GridColDef<ClassPapers>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: true,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
  ];

*/


const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

const PapersGrid = ({classPapers, pupilId} : {classPapers : ClassPapers, pupilId: string}) => {
    
    const columns: GridColDef<ClassPapers>[] = [
        { field: 'id', headerName: 'ID', width: 50},
        { field: 'tag', headerName: 'Class', width: 90 },
        { field: 'paperName', headerName: 'Paper', width: 180, 
            renderCell: (params: GridRenderCellParams<any, Date>) => (<Link href={`/spec-items/${pupilId}/${params.row.classId}/${params.row.paperId}/enter-marks`}>{params.row.year}-{params.row.month}-{params.row.paper}</Link>),
            //@ts-ignore
            valueGetter: (value, row) => `${row.year}-${row.month}-${row.paper}`},
        { field: 'availableFrom', headerName: 'Available From', valueGetter: (value: string, row) => `${value && value.substring(5, 10)}`},
        { field: 'completeBy', headerName: 'Complete By', valueGetter: (value: string, row) => `${value && value.substring(5, 10)}`},
        { field: 'markBy', headerName: 'Mark By', valueGetter: (value: string, row) => `${value && value.substring(5, 10)}`},
        
      ];

    
    return <DataGrid
    /* @ts-expect-error */
    rows={classPapers.filter(cp => cp.markBy != null).map((r) => ({...r, id: `${r.classId}-${r.paperId}`})).sort((a, b)=> a.markBy < b.markBy ? 1 : -1)}
    
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
