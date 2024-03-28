import {Paper} from "@mui/material";
import styles from "./page.module.css";
import ClassGraph from "./class-graph";
import DisplaySpecItems from "./display-spec-items";

const Page = async ({params} : {params : {pupilId: string, classId : string, }}) => {
    const {pupilId, classId} = params;
    return <>
            <Paper className={styles.mainPage}>
                <h1>Details for {pupilId} - {classId}</h1>
                <h3></h3>
                <ClassGraph />
                <DisplaySpecItems />
            </Paper>
        </>
}
export default Page;