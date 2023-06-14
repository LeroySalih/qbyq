"use client";
import styles from "./side-bar.module.css"
import Link from "next/link";

import {User } from "@supabase/supabase-js";
 
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import GradingOutlinedIcon from '@mui/icons-material/GradingOutlined';
import FlashOnOutlinedIcon from '@mui/icons-material/FlashOnOutlined';

import { usePathname } from "next/navigation";
import { useSupabase } from "components/context/supabase-context";
import { useEffect, useState } from "react";

const SideBar = () => {
    
    const [user, setUser] = useState<User | null>();

    const pathName = usePathname();
    const {supabase} = useSupabase();

    const loadUser = async () => {
        const {data: {user}} = await supabase.auth.getUser();

        setUser(user);        
    };

    useEffect(()=> {
        loadUser();
    }, []);

    const isActive = (path: string) => {
        
        return pathName?.includes(path)
    }

    console.log("Pathname", pathName);
    return <div className={styles.sideBar}>
        {user && (
            <ul className={styles.ul}>
                <li className={isActive('home') ? styles.active : styles.inactive}><Link href={`/`}><HomeOutlinedIcon />Home</Link></li>
                <li className={isActive('dashboard') ? styles.active : styles.inactive}><Link href={`/app/dashboard/${user.id}`} ><ArticleOutlinedIcon />Past papers</Link></li>
                <li className={isActive('spec-report') ? styles.active : styles.inactive}><Link href={`/app/spec-report/${user.id}`}><GradingOutlinedIcon />Analysis</Link></li>
                <li className={isActive('flashcards') ? styles.active : styles.inactive}><Link href={`/app/flashcards`}><FlashOnOutlinedIcon />Flashcards</Link></li>
                
            </ul>
        )}
        
    </div>
}

export default SideBar;