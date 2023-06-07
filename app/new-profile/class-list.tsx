
import {useSupabase } from "components/context/supabase-context";
import {useEffect, useState} from 'react';

type ClassDesriptor = {
    id: number,
    tag: string,
    title: string    
}

type ClassDescriptorList = ClassDesriptor[];


const ClassList = ({userid}:{userid: string}) => {

    const {supabase} = useSupabase();
    const [classes, setClasses] = useState<ClassDescriptorList>([]);
    const [classToJoin, setClassToJoin] = useState<ClassDesriptor | null>(null);

    const buildClass = ({Classes}: {Classes: {id: number, tag: string, title: string}}) => {
        return {id: Classes!.id, tag: Classes!.tag, title: Classes!.title}
    }
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
    return 
        <>
        <div>
            <div>
                <input />
                <button>Check</button>
            </div>
            <div>
                <span>Mr Salih's IT Class</span>
                <button>Join</button>
            </div>
        </div>
        <ul>
        {classes && classes.map((c, i) => <li key={i}>{c.title}</li>)}
        </ul>
        </>
        
}


export default ClassList;