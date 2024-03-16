import {Grid} from "@mui/material";
import styles from "./page.module.css";

const DisplayVideo = ({code, summary}: {code: string, summary: string}) => {

    const embedUrl = `https://www.youtube.com/embed/${code}`;
  
    return <div>
      <Grid container>
        <Grid item xs={12} >
          <iframe 
                width="100%"
                height="400"
                src={embedUrl} title="YouTube video player"  
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen>
        </iframe>
        </Grid>
        <Grid item xs={12} >
          <div className={styles.summary}>{summary}</div>
        </Grid>
      </Grid>
      
      
    </div>
  }


export default DisplayVideo;