"use client";

import {useState, useEffect, useContext} from 'react';
import Link from "next/link";
import supabase from "app/utils/supabase/client"

const DisplayFiles = async ({paperId} : {paperId : number}) => {

        
    const {data: {user}} = await supabase?.auth.getUser() || {data: {user: null}};
    
    const [userFiles, setUserFiles] = useState<{ name: string; signedUrl: string; }[] | undefined>([]);

    const loadFiles = async () => {

        const path =  `${user!.id}/${paperId}`;

        const {data: listFiles, error} = await supabase?.storage
                        .from('exam-papers')
                        .list(path, {
                            limit: 100,
                            offset: 0,
                            sortBy: { column: 'name', order: 'asc' },
                          }) || {data: null, error: null};

        const {data: downloadUrls, error: downloadError }  = await supabase?.storage
                        .from('exam-papers')
                        .createSignedUrls(
                            listFiles?.map(lf => `${path}/${lf.name}`) || [], 3600, {download: true}
                        ) || {data: null, error: null};

        error && console.error(error)
                
        // // console.log("Files", downloadUrls);

        setUserFiles(listFiles?.map(
                (lf, i) => (
                    {   
                        name: lf.name, 
                        signedUrl: downloadUrls![i].signedUrl
                    } || {}
                    ) 
                )
        )
    }

    const handleFileChange = async (e:any) => {
        // // console.log(e.target.files[0])

        const uploadFile = e.target.files[0];
        const {data, error} = await supabase!
                                        .storage
                                        .from('exam-papers')
                                        .upload(`/${user!.id}/${paperId}/${uploadFile.name}`, uploadFile, {
                                            cacheControl: '3600',
                                            upsert: false
                                            });

        error && console.error(error);
        // // console.log(data)

        loadFiles();
    }

    return <>
    <input type="file" name="upload" onChange={handleFileChange}/>
    <ul>
    { userFiles && userFiles.map((uf,i) => <li key={i}>
        <Link href={uf.signedUrl} key={i}>{uf.name}</Link>
        </li>)
    }
    </ul>
    </>
}


export default DisplayFiles;