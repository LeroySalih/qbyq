"use client";

import supabase from "app/utils/supabase/client";

import styles from "./nav-bar.module.css";
import {useEffect, useState} from "react";
import {User} from "@supabase/supabase-js";

import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';

import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useRouter } from "next/navigation";
import Link from "next/link";

const NavBar = () => {

    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();
    
    const loadUser = async() => {

      const {data: {user}} = await supabase.auth.getUser();

      setUser(user);

    }

    useEffect(()=>{
      loadUser();

      const {data: {subscription} } = supabase.auth.onAuthStateChange((event, session)=> {
      
        if (session){
          const u = session.user;
          setUser(u);
          router.push(`/app/spec-report/${u.id}`);
        } else {
          setUser(null);
          router.push(`/`);
        }
      
      });

      return ()=> {
        subscription.unsubscribe();
      }
    }, []);


    const handleSignIn = async () => {

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'azure',
          options: {
            scopes: 'email',
            redirectTo: process.env.NEXT_PUBLIC_SITE_REDIRECT
          },
        });
    
    
        error && console.error(error);
        console.log("Sending to home page")
       // router.push("/");
        // console.log(data);
    }
    
    const handleSignOut = async () => {
        const error = await supabase.auth.signOut();
    
        error && console.error("Error", error);
        console.log("Sending to home page")
        router.push("/");
    }

    const handleGoToProfile = () => {

      router.push('/app/new-profile')
    }

    
      
    return <>
    <div className={styles.navbar}>
        <div className={styles.banner}>
          <Link href="/">
            <img className={styles.logo} src="/qbyq-logo.png" width="20px" height="20px" alt="Logo Idea by Ethan Lopez"/>
          </Link>
          <div className={styles.siteTitle}>QbyQ</div>
        </div>
        <div>
          {user && <span>{user.email}</span>}

          {user && <IconButton onClick={handleGoToProfile} aria-label="delete" size="small">
                      <AccountBoxOutlinedIcon fontSize="large"/>
                   </IconButton>}
          
          {user && <IconButton onClick={handleSignOut} aria-label="delete" size="small">
                    <LogoutIcon fontSize="large" />
                  </IconButton>}
          {user == null && <IconButton onClick={handleSignIn} aria-label="delete" size="small">
                    <LoginIcon fontSize="large" />
                  </IconButton>}

        </div>  
    </div>
   
  </>
} 

export default NavBar;