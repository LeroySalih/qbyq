"use client"

import supabase from "app/utils/supabase/client";
import {ChangeEventHandler, useEffect, useState} from "react";
import { updateQueue } from "./updateQueue";
import {User} from "@supabase/supabase-js";
import styles from "./upload.module.css";


const machineOptions = [
    "Select",
    "3D Printer", 
    "Laser Cutter",
]

type Ticket = {
    machine: string | null;
    file: File | null;
    notes: string | null;
}


const Upload = ({userid}: {userid: string}) => {

    const [file, setFile] = useState(null);
    const [user, setUser] = useState<User | null>(null);
    const [machine, setMachine] = useState<string>("Select");
    const [notes, setNotes] = useState<string>("");


    const [profile, SetProfile] = useState<{
        id: string;
        firstName: string;
        familyName: string;
     } | null>(null);

    const uploadFile = async ({machine, file, notes}: Ticket) => {

        console.log("Uploading file")

        if (!file) {
            console.log("File is null, returning")
            return;
        }

        // Upload the file
        const {data, error} = await supabase.storage.from("work-queue").upload(`${userid}/${file.name}`, file, {
            upsert: true 
        });

        console.log(data);

        error && console.error(error)

        const {data: urlData} = supabase.storage.from("work-queue").getPublicUrl(`${userid}/${file.name}`)
        
        console.log(urlData);

        const result = await updateQueue(userid, urlData.publicUrl, `${userid}/${file.name}`, machine || "", notes || "");

        console.log(result);

    }

    const handleUploadFile = () => {
        uploadFile({machine, file, notes});
    }

    const handleFileChange = (e: FileList | null) : void => {
        console.log(e);
        // @ts-ignore
        setFile(e[0]);
    }

    const loadUser = async () => {
        const {data, error} = await supabase.auth.getUser();
        error && console.error(error);

        setUser(data.user);
    }

    const loadProfile = async (userid: string | null) => {

        if (!userid) return;

        const {data, error} = await supabase.from("Profile").select("id, firstName, familyName").eq("id", userid).maybeSingle();

        error && console.error(error);

        SetProfile(data);
    }

    useEffect(()=> {
        loadUser();
    }, [])

    useEffect(()=> {
        loadProfile(user && user.id)
    }, [user])

    return <>
        <div className={styles.uploadLayout}>
        {user && <div>Creating a ticket for {profile?.firstName} {profile?.familyName} </div>}
        
        <select value={machine} onChange={(e) => setMachine(e.target.value)}>
            {machineOptions && machineOptions.map((mo, i) => <option value={mo} key={i}>{mo}</option>) }
        </select>
        <input type="file" onChange={(e) => handleFileChange(e?.target?.files)}/>
        <input type="text" value={notes} placeholder="notes" onChange={(e) => setNotes(e.target.value)}/>
        <button onClick={handleUploadFile} disabled={file === null || machine == "Select"}>Submit</button>
        
        </div>
    </>
}

export default Upload;