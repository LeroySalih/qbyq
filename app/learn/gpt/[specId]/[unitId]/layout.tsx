
import styles from "./layout.module.css";
import DailyAnswers from "./daily-answers";

const Layout = ({children} : {children: React.ReactNode}) => {
    return <>
    <DailyAnswers/>
    <div className={styles.window}>
        {children}
    </div>
    </>
}


export default Layout;