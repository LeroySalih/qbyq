import styles from "./display-queues.module.css";
import dayjs from 'dayjs'

import {FCQueue} from "types/alias";

const DisplayQueues = ({queue}:{queue:FCQueue}) => {
    
    if (!queue)
        return <h1>No Queues Passed</h1>
        
    const today = dayjs().toDate();
    const week = dayjs().add(1, 'week').toDate();
    const month = dayjs().add(1, 'month').toDate();

    const todayCount = queue.filter(q => dayjs(q.dueDate).toDate() <= today).length;
    const weekCount = queue.filter(q => today < dayjs(q.dueDate).toDate() && dayjs(q.dueDate).toDate() <= week).length;
    const monthCount = queue.filter(q => dayjs(q.dueDate).toDate() > week).length;

    return <div className={styles.gridContainer}>
        <div className={styles.grid}>
            <div>Today</div><div>{todayCount}</div>
            <div>Week</div><div>{weekCount}</div>
             <div>Month</div><div>{monthCount}</div>
        </div>
    </div>
}

export default DisplayQueues;