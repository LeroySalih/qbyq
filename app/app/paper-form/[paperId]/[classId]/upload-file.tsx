"use client"

import { User } from "@supabase/supabase-js";
import supabase from "app/utils/supabase/client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import Link from "next/link";
import {Button} from "@mui/material";

const UploadFile = ({paperId, user} : {paperId: number, user: User | null}) => {

    const [uploads, setUploads] = useState(null);
    const [urls, setUrls]  = useState< {
        error: string | null;
        path: string | null;
        signedUrl: string;
    }[] | null>(null);

    const [file, setFile] = useState<File | null>(null);

    useEffect(()=> {
        loadFiles();
    }, [user])

    if (!user){
        return <h1>No User Logged In</h1>
    }

    const dt = DateTime.now().toISODate()

    const loadFiles = async () => {

        console.log("Loading Files");

        if (!user) {
            return;
        }

        const {data: uploads, error: uploadsError} = await supabase.from("WorkUploads").select("id, fileName, dt, path").eq("owner", user.id).eq("paperId", paperId);

        if (!uploads){
            return;
        }
        
        //@ts-ignore
        setUploads(uploads);


        // "work-upload/0d65c82d-e568-450c-a48a-1ca71151e80f/25/2024-03-19/data-files.zip"
        if (uploads.length == 0){
            console.log("No uploads found");
            setUrls([]);
            return;
        }
        
        const {data:urls, error: urlsError} = await supabase.storage.from("work-upload").createSignedUrls(uploads.map(f => f.path), 3600);

        urlsError && console.error(urlsError);
        console.log("uploads", uploads);
        console.log("urls", urls);

        
        //@ts-ignore
        setUrls(urls);

        
    }

    const getUrlFromPath = (path: string) => {
        if (!path || !urls || !uploads) {
            return null;
        }

        const result = urls.filter(u => u.path == path)

        return result && result[0] && result[0].signedUrl
    }

    

    const handleFileUpload = async () => {

        if (!file){
            return;
        }
        
        console.log("Creating resource in storage")
        // "work-upload/0d65c82d-e568-450c-a48a-1ca71151e80f/25/2024-03-19/data-files.zip"
        // 
        const {data, error} = await supabase.storage.from("work-upload").upload(`${user.id}/${paperId}/${dt}/${file.name}`, file, {
            upsert: true,
          });
        
        error && console.error(error);

        if (error){
            return;
        }

        const {path} = data;
        console.log(path);

        console.log("Writing to db")
        await supabase.from("WorkUploads").delete()
                            .eq("owner", user.id)
                            .eq("paperId", paperId)
                            .eq("fileName", file.name);

        const {data: uploadData, error: uploadError} = await supabase.from("WorkUploads").upsert({
            owner: user.id, 
            paperId, dt, path, 
            fileName: file.name}).select("id");


        uploadError && console.error(uploadError);

        console.log("Updated", data, uploadData);

        loadFiles();
        
    }

    const handleDeleteFile = async (id: string, path: string) => {

        console.log("Deleting", id, path);

        const {data, error } = await supabase.storage.from("work-upload").remove([path]);

        error && console.error(error);
        console.log(data);
        
        console.log("Deleting upload:", id, "from table");
        const {data: deleteData, error: deleteError} = await supabase.from("WorkUploads").delete().eq("id", id).select("id");

        error && console.error(deleteError);
        
        if (!error) {
            //@ts-ignore
            setUploads((prev) => prev && prev.filter(u => u.id != id));
        }

    }

    

    return <div>
        <input type="file" onChange={(e) => setFile(e.target.files && e.target.files[0])}/>
        <button disabled={file == null} onClick={handleFileUpload}>Upload</button>
        {
            //@ts-ignore
            uploads && uploads.map((u,i) => <div key={i}><Link href={getUrlFromPath(u.path) || ""}>  {u.fileName} </Link> <Button onClick={() => handleDeleteFile(u.id, u.path)}>X</Button></div>)
        }
        
        </div>
}

export default UploadFile;