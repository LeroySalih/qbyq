"use client";

import { useSupabase } from "components/context/supabase-context";
import styles from "./nav-bar.module.css";
import {useEffect, useState} from "react";
import {User} from "@supabase/supabase-js";


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
        console.log(data);
    }
    
    const handleSignOut = async () => {
        const error = await supabase.auth.signOut();
    
        console.log("Error", error);
    }
      
    return <>
    <div className={styles.navbar}>
        <div className={styles.banner}>
          <img className={styles.logo} src="/qbyq-logo.png" width="80px" height="80px" alt="Logo Idea by Ethan Lopez"/>
          <h1>Question By Question (QbyQ)</h1>
        </div>
        <div>
          
          {user && <button onClick={handleSignOut}>Sign Out</button>}
          {!user && <button onClick={handleSignIn}>Sign In</button>}

        </div>  
    </div>
   
  </>
} 

export default NavBar;