"use client";
import "./globals.css"
import styles from './layout.module.css';
import {useState, useEffect} from 'react';
import {createClient} from '@supabase/supabase-js' 
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { SupabaseContext } from "components/context/supabase-context";

export default function RootLayout({children,}: {children: React.ReactNode}) {

  console.log("Layout Running");
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();

  const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

  const [supabase] = useState(()=> createBrowserSupabaseClient({supabaseUrl, supabaseKey}));

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

  useEffect(() => {
    
    const {data: {subscription}} = supabase.auth.onAuthStateChange( ()=> {
      router.refresh();
    });

    return ()=> {
      subscription.unsubscribe();
    }

  }, [supabase, router]);

  return (
    <SupabaseContext.Provider value={{supabase}}>
    <html>
      <head />
        <body>
          <div className={styles.navbar}>
            <img className={styles.logo} src="/qbyq-logo.png" width="80px" height="80px" alt="Logo Idea by Ethan Lopez"/>
            <h1>Question By Question (QbyQ)</h1>
          </div>
          <div>
            <button onClick={handleSignIn}>Sign In</button>
            <button onClick={handleSignOut}>Sign Out</button>

          </div>
          {children}
        </body>
       
    </html>
    </SupabaseContext.Provider>
  )
}



