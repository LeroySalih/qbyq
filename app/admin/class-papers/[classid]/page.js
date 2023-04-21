"use client"
import supabase from 'components/supabase';
import {useState, useEffect, useMemo} from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid, {textEditor} from 'react-data-grid';
import { idText } from 'typescript';


const ClassPapers = ({params}) => {

    const {classid} = params;

    const [classData, setClassData] = useState(null);
    const [papers, setPapers] = useState(null);
    const [classPapers, setClassPapers] = useState(null);
    const [rows, setRows] = useState(null);

    const loadClassData = async (classid) => {
        const {data, error} = await supabase.from("Classes").select().eq("id", classid).single();

        error && console.error(error);

        console.log("Class Data", data);
        setClassData(data);
    } 

    const loadPapersForSpec = async (specId) => {
        const {data, error} = await supabase.from("Papers").select().eq("specId", specId);

        error && console.error(error);

        console.log("Papers", data);
        setPapers(data);
    }

    const loadPapersForClass = async (classid) => {
        const {data, error} = await supabase.from("ClassPapers").select().eq("classId", classid);

        error && console.error(error);

        console.log("Class Paper", data);
        setClassPapers(data);
    }

    const shapeRows = () => {
        
        if (!papers || !classPapers) return null;

        return papers.map(p => ({...p}))

    }


    useEffect(()=> {

        loadClassData(classid);
        loadPapersForClass(classid);

    }, [classid])


    useEffect(()=> {
        loadPapersForSpec(classData?.specId);
    }, [classData]);

    useEffect(()=> {
        setRows(shapeRows())
    }, [
        classPapers, papers
    ])


    const cols = [
        {
            key: "id",
            name: "id"
        },
        {
            key: "year",
            name: "Year"
        },

    ] 

    return <><h1>Class Papers for {classData?.tag}(specId: {classData?.specId})</h1>
        {cols && rows && <DataGrid cols={cols} rows={rows}/>}
        <h1>Class Papers</h1>
        <pre>{JSON.stringify(classPapers, null, 2)}</pre>
        <h1>Papers</h1>
        <pre>{JSON.stringify(papers, null, 2)}</pre>
    </>
}


export default ClassPapers;