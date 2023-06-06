import styles from "./display-queues.module.css";
import dayjs from 'dayjs'

import {FCGetQueueSummaryReturn} from "types/alias";

const DisplayQueueSummary = ({queueSummary}:{queueSummary:FCGetQueueSummaryReturn}) => {
    
    if (!queueSummary)
        return <h1>No Queues Passed</h1>
        
    
    //@ts-ignore
    const summaryObj = queueSummary.reduce( (prev, curr: {isDue: string, count: number}) => {prev[curr.isDue] = curr.count; return prev;}, {} as {})

    return <div className={styles.gridContainer}>
        <div className={styles.grid}>
            
            <div>Due</div>
            
            <div>{//@ts-ignore
                    summaryObj['true'] || 0
                }
            </div>
            
            <div>Pending</div>
            
            <div>{//@ts-ignore
                summaryObj['false'] || 0
                }</div>
        </div>
    </div>
}

export default DisplayQueueSummary;