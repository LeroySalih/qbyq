import "./globals.css"

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import NavBar from "./nav-bar";
import styles from "./layout.module.css"
import {getUser} from "../lib/server";

const RootLayout = async ({children} : {children: React.ReactNode}) => {

  const user = await getUser();


  
  return (
    
    <html>
      <head />
        <body>
          <NavBar />
          
          <div className={styles.pageLayout}>
            {children}
          </div>
          <div className={styles.footer}>
          {user && user.id}
          </div>
        </body>
    </html>
    
      
  )
}



export default RootLayout;



