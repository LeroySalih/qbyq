"use client"

import { MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const Selector = ({classtag, classes} : {classtag: string, classes: {
    tag: any;
}[] | null | undefined}) => {

    // @ts-ignore
    //const {classtag, classes} = params;
    const router = useRouter();

    const handleChange = (e: SelectChangeEvent<any>, child: ReactNode) => {
        router.push(`/admin/check-class-2/${e.target.value}`)
    }

    return <Select value={classtag} onChange={handleChange}>{classes?.map((c: {tag: string},i: number) => <MenuItem key={c.tag} value={c.tag}>{c.tag}</MenuItem>)}</Select>
}

export default Selector