"use client";

import { useSupabase } from "components/context/supabase-context";
import styles from "./nav-bar.module.css";
import {useEffect, useState} from "react";
import {User} from "@supabase/supabase-js";

import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

const NavBar = () => {

    const {supabase} = useSupabase();
    const [user, setUser] = useState<User | null>(null);

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
        } else {
          setUser(null);
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
        // console.log(data);
    }
    
    const handleSignOut = async () => {
        const error = await supabase.auth.signOut();
    
        error && console.error("Error", error);
    }

    console.log(user);
      
    return <>
    <div className={styles.navbar}>
        <div className={styles.banner}>
          <img className={styles.logo} src="/qbyq-logo.png" width="80px" height="80px" alt="Logo Idea by Ethan Lopez"/>
          <h1>Question By Question (QbyQ)</h1>
        </div>
        <div>
          
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