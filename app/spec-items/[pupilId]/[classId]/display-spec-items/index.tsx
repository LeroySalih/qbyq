"use client"

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

type SpecItemData = {
    "_specId": number,
    "_specItemId": number,
    "_specItemTag": string,
    "_specItemTitle": string,
    "_questionMarks": number,
    "_answerMarks": number
  }

const DisplaySpecItems = ({specItems} :  {specItems :SpecItemData[] | null}) => {

    const columns: GridColDef<SpecItemData>[] = [
        { field: '_specItemId', headerName: 'ID', width: 50},
        { field: '_specItemTag', headerName: 'Tag', width: 80},
        { field: '_specItemTitle', headerName: 'Title', width: 320},
        { field: '_questionMarks', headerName: 'Available Marks', width: 180},
        { field: '_answerMarks', headerName: 'Answered Marks', width: 180},
    ];

    return <>
        <h3>Spec Items</h3>
        <DataGrid
            columns={columns}
            rows={specItems!.map((si) => ({id: si._specItemId, ...si}))}
        />
        
    </>
}

export default DisplaySpecItems;