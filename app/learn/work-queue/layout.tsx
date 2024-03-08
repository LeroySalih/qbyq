

import styles from "./layout.module.css"

const WorkQueueLayout = ({children} : {children: React.ReactNode}) => {
    return <div className={styles.layout}>{children}</div>
}

export default WorkQueueLayout;