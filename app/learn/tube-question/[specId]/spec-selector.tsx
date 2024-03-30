"use client"
import {Select, MenuItem} from "@mui/material";
import supabase from "app/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



const SpecSelector = ({specId} : {specId: number}) => {

    const [specs, setSpecs] = useState<{ id: number; title: string | null; }[] | null>();
    
    const router = useRouter();

    const loadSpecs =  async () => {

        try {
                
            if (!supabase){
                throw new Error("Supabase client not created")
            }
    
            const {data, error} = await supabase?.from("Spec").select("id, title");
            
            
    
            setSpecs(data);
    
        } catch(error) {
    
            console.error(error);
    
            return {specs: null, error: error}
        
        } 
    }

    const handleChange = (specId: number) => {
        
        router.push(`/learn/tube-question/${specId}`);
    }

    useEffect(()=>{
        loadSpecs();
    }, []);
    return <Select defaultValue={specId} onChange={(e) => handleChange(e.target.value as number)}>
    
    {specs && specs.map((s, i) => <MenuItem value={s.id} key={s.id}>{s.title}</MenuItem>)}

</Select>

}

export default SpecSelector;