
// import {useSupabase } from "components/context/supabase-context";
import {useEffect, useState} from 'react';
import supabase from "app/utils/supabase/client";

type ClassDescriptor = {
    id: number,
    tag: string,
    title: string    
}

type ClassDescriptorList = ClassDescriptor[];


const ClassList = ({userid}:{userid: string}) => {

    // 
    const [classes, setClasses] = useState<ClassDescriptorList>([]);
    const [classToJoin, setClassToJoin] = useState<ClassDescriptor | null>(null);
    const [classCode, setClassCode] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const buildClass = ({Classes}: {Classes: {id: number, tag: string, title: string}}) => {
        return {id: Classes!.id, tag: Classes!.tag, title: Classes!.title}
    };

    const loadClasses = async () => {

        const {data, error} = await supabase
                                .from("ClassMembership")
                                .select("*, Classes(*)")
                                .eq("pupilId", userid);

        error && console.error(error);

        if (!data)
            return;

        //@ts-ignore
        setClasses(data?.map(buildClass));

    }

    useEffect(()=> {
        loadClasses();
    }, []);

    const handleCheckClass = async () => {
        const {data, error} = await supabase.from("Classes").select().eq("tag", classCode).maybeSingle();

        error && console.error(error);

        console.log("Class:", data);

        if (!data){
            setClassToJoin(null);
            setMessage("Unknown class code")
        } else {
            //@ts-ignore
            setClassToJoin(data);
            setMessage("Joining class: " + data.title)
        }

    }

    const handleJoinClass = async () => {
        
        if (!classToJoin){
            return;
        }

        const insertObj = {classId: classToJoin.id, pupilId : userid}

        const {data, error} = await supabase.from("ClassMembership").insert(insertObj);

        error && console.error(error);

        console.log("Added ", {classId: classToJoin.id, pupilId : userid})

        setClassCode('');
        setMessage('Added to class: ' + classToJoin.title)
        setClasses(prev => [...prev, {id: classToJoin.id, tag: classToJoin.tag, title: classToJoin.title}]);
    }

    return <>
        <div>
            <div>
                <input value={classCode} onChange={(e) => setClassCode(e.target.value)}/>
                <button onClick={handleCheckClass}>Check</button>
            </div>
            <div>
                <span>{message}</span>
                <button onClick={handleJoinClass} disabled={classToJoin === null}>Join</button>
            </div>
        </div>
        <ul>
        {classes && classes.map((c, i) => <li key={i}>{c.title}</li>)}
        </ul>
        
        </>
        
}


export default ClassList;