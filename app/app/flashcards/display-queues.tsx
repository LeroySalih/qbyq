import styles from "./display-queues.module.css";
import dayjs from 'dayjs'

import {Queue} from "./types";

const DisplayQueues = ({queue}:{queue:Queue}) => {
    
    if (!queue)
        return <h1>No Queues Passed</h1>
        
    const today = dayjs().toDate();
    const week = dayjs().add(1, 'week').toDate();
    const month = dayjs().add(1, 'month').toDate();

    const todayCount = queue.filter(q => q.dueDate <= today).length;
    const weekCount = queue.filter(q => today < q.dueDate && q.dueDate <= week).length;
    const monthCount = queue.filter(q => q.dueDate > week).length;

    return <div className={styles.gridContainer}>
        <div className={styles.grid}>
            <div>Today</div><div>{todayCount}</div>
            <div>Week</div><div>{weekCount}</div>
             <div>Month</div><div>{monthCount}</div>
        </div>
    </div>
}

export default DisplayQueues;