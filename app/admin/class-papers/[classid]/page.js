"use client"
import supabase from 'app/utils/supabase/client';
import {useState, useEffect, useMemo} from 'react';
import 'react-data-grid/lib/styles.css';



const ClassPapers = ({params}) => {

    const {classid} = params;

    const [classData, setClassData] = useState(null);
    const [papers, setPapers] = useState(null);
    const [assignedPapers, setAssignedPapers] = useState(null);


    const [rows, setRows] = useState([{id:1, year: 2020}])

    const loadClassData = async (classid) => {
        const {data, error} = await supabase.from("Classes")
                                .select("id, tag, specId")
                                .eq("id", classid)
                                .maybeSingle()

        error && console.error(error);

        console.log("classData", data);
        setClassData(data);
    }

    const loadPapersForClass = async (classid) => {
        const {data, error} = await supabase.from("ClassPapers")
                                .select("paperId")
                                .eq("classId", 11)
                                
                                

        error && console.error(error);

        console.log("assignedPapers", data);

        setAssignedPapers(data);
    }

    useEffect (()=> {
        loadClassData(classid);
        loadPapersForClass(classid);
    }, [])
    
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

    return <>{
        classData && <h1>Class Papers for {classData?.tag}(specId: {classData?.specId})</h1>
        }
        
        <h1>Assigned Papers</h1>
        <pre>{JSON.stringify(assignedPapers, null, 2)}</pre>
        
    </>
}


export default ClassPapers;