
import { YoutubeTranscript } from 'youtube-transcript';
import styles from "./page.module.css";
import OpenAI from 'openai';
import {Grid} from "@mui/material";

import {createSupabaseServerClient} from "app/utils/supabase/server";


import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ReactElement } from 'react';


import DisplayQuestion from "./display-question";
import DisplayVideo from "./display-video";

//const model = "gpt-3.5-turbo"
const model = "gpt-4"

// console.log("Open Api Key", process.env.OPENAI_API_KEY );

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });



const Page = async ({params}: {params: {code: string}}) => {

  const {code} = params;

  const supabase = createSupabaseServerClient(false);

  const getSummary = async (code: string) => {
    
    if (!supabase) {
      throw("Supabase not defined");

    }
    try {

      const {data: summary, error} = await supabase.from("dqPage").select("id, summary, specItemId").maybeSingle();

      if (error) {
        throw(error);
      }

      return {summary: summary?.summary, error: null}

    } catch(error) {
      console.error(error);
      return {summary: null, error}
    }

  }

  const {summary, error} = await getSummary(code);
  

  try {
    
    return <div className={styles.layout}>
      <h1>Item</h1>
      { //@ts-ignore 
      }
      <DisplayVideo code={code} summary={summary}/>
      { //@ts-ignore 

      <DisplayQuestion code={code} />
      }
    </div>

  } catch (error) {
      console.error(error)

      //@ts-ignore
      return <h1>Error: {error.message}</h1>;
  }
    
}

export default Page;







