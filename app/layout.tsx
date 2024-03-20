"use client";
import "./globals.css"

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import NavBar from "./nav-bar";
import styles from "./layout.module.css"

const RootLayout = ({children} : {children: React.ReactNode}) => {

  //console.log("Layout Running");
  
  return (
    
    <html>
      <head />
        <body>
          <NavBar />
          {children}
        </body>
    </html>
    
      
  )
}



export default RootLayout;



