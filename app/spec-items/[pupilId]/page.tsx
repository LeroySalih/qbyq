
import {Paper, Grid} from "@mui/material";
import styles from "./page.module.css";
import getAllPapers from "./all-papers";
import AllPapers from "./all-papers";


const Page = async ({params} : {params : {pupilId : string}}) => {
     const {pupilId} = params;
     const allPapersGrid = await AllPapers(pupilId);
     return <>{allPapersGrid}</>
}
export default Page;