import styles from "./page.module.css"

const RootLayout = ({children} : {children: React.ReactNode}) => {
    return <div className={styles.layout}>{children}</div>
}

export default RootLayout