
import {Paper, Grid} from "@mui/material";
import styles from "./page.module.css";

const Page = async ({params} : {params : {pupilId : string}}) => {
     const {pupilId} = params;
     return <>
          <Paper className={styles.mainPage}>
                    <h2>All Papers Due for {pupilId}</h2>
                    <Grid container>
                        <Grid item xs={1}>Class</Grid>
                        <Grid item xs={2}>Subject</Grid>
                        <Grid item xs={1}>Year</Grid>
                        <Grid item xs={1}>Paper</Grid>
                        <Grid item xs={1}>From</Grid>
                        <Grid item xs={2}>Complete By</Grid>
                        <Grid item xs={2}>Mark By</Grid>
                        <Grid item xs={2}>Marks</Grid>
                    </Grid>
                </Paper></>
}
export default Page;