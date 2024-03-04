import Nav from "./nav"
import styles from "./page.module.css"
export default function TestLayout({children}: {children: React.ReactNode}) {

    return (
        <div className={styles.layout}>
            <h1>Admin report for: <Nav></Nav></h1>
            {children}
        </div>
    )
}