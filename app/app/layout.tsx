import styles from "./layout.module.css"
import SideBar from "./side-bar";

const Layout = ({children} : {children: React.ReactNode}) => {
    return <div className={styles.page}>
            {// <div> //<SideBar /> 
             // </div>
            }

            <div className={styles.pageContents}>{children}</div>
           </div>
}


export default Layout;