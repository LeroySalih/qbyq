"use client"

import supabase from "app/utils/supabase/client";
import {useState, useEffect} from "react";
import {Select, MenuItem} from "@mui/material";
import { useRouter } from "next/navigation";

type Spec = {
    id: number;
    title: string | null;
}

type Unit = {
        id:     number;
        title:  string | null;
};

const UnitSelector = ({specId, unitId} :  {specId:number, unitId: number}) => {

    
    const [currentSpecId, setCurrentSpecId] = useState<number>(specId);
    const [currentUnitId, setCurrentSpecItemTag] = useState<number>(unitId);
    const [specs, setSpecs] = useState<Spec[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);

    const router = useRouter();
    const loadSpecs = async () => {

        const {data, error} = await supabase.from("Spec").select("id, title");

        if (error){
            console.log(error);
            setSpecs([]);
            return;
        } 

        setSpecs(data); 

    }

    const loadUnits = async (specId: number) => {

        const {data, error} = await supabase.from("SpecUnits").select("id, title").eq("specId", specId);

        if (error){
            console.log(error);
            setSpecs([]);
            return;
        } 
        console.log("Units", units)
        setUnits(data); 

    }


    useEffect(()=> {
        loadSpecs();
    }, []);


    useEffect(()=> {
        loadUnits(currentSpecId);
    }, [currentSpecId])

    const handleSpecItemChange = (unitId: number) => {
        router.push(`/learn/gpt/${currentSpecId}/${unitId}`);
    }

    return <>
        <Select  value={currentSpecId} onChange={(e) => setCurrentSpecId(parseInt(e.target.value as string, 10))}>
            {specs && specs.map((s,i)=><MenuItem key={i} value={s.id}>{s.title}</MenuItem>)}
        </Select>
        <Select  value={currentUnitId} onChange={(e) => handleSpecItemChange(e.target.value as number)}>
            {units && units.map((u,i)=><MenuItem key={i} value={u.id!}>{u.title}</MenuItem>)}
        </Select>
    </>

}

export default UnitSelector;