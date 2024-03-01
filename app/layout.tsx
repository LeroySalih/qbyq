"use client";
import "./globals.css"

import SupabaseProvider  from "components/context/supabase-context";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import NavBar from "./nav-bar";

const RootLayout = ({children} : {children: React.ReactNode}) => {

  //console.log("Layout Running");
  
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



