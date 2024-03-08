import { Suspense } from "react"
import styles from "./page.module.css"

const sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const loadSlowData = async () => {
    await sleep(20000)
    return Math.random()
}


const loadQuickData = async () => {
    await sleep(100)
    return Math.random()
}


const DisplaySlowData = async () => {
    const data = await loadSlowData();

    return <div>{data}</div>
}

const DisplayQuickData = async () => {
    const data = await loadQuickData();

    return <div>{data}</div>
}



const Page = async () => {
    
    // a single page, after logging on
    // see where your builds are in the queue
    // see the status of builds
    // add a new build -> a dialog to upload the file, specify the 

    console.log("Running on server")

    return <div className={styles.layout}>
        <h1>This is run on the server</h1>
        <Suspense fallback={<div>Loading Slow Data</div>}>
            {/* @ts-expect-error Async server Component*/}
            <DisplaySlowData />
        </Suspense>
        
        
        <Suspense>
            {/* @ts-expect-error Async server Component*/}
            <DisplayQuickData />
        </Suspense>
        

    </div>
}

export default Page;