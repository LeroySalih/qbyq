"use client";
import "./globals.css"
import styles from './layout.module.css';
import {useState, useEffect} from 'react';
import {AuthChangeEvent, Session, User, createClient} from '@supabase/supabase-js' 

import { useRouter } from "next/navigation";
import SupabaseProvider  from "components/context/supabase-context";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from '@supabase/auth-helpers-react';

import { TestContext } from "components/context/test-context";



import NavBar from "./nav-bar";

const RootLayout = async ({children}: {children: React.ReactNode}) => {

  console.log("Layout Running");
  
  return (
    
    <html>
      <head />
        <body>
        <SupabaseProvider>
          <NavBar />
          {children}
          
        </SupabaseProvider>
        </body>
    </html>
    
      
  )
}



export default RootLayout;



