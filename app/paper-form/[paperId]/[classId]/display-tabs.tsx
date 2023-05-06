"use client";

import DisplayQuestions from './display-questions';
import DisplayFiles from './display-files';
import DisplayResources from "./display-resources";
import { useEffect , useState, useContext} from "react";
import {TestContext, TestContextType} from 'components/context/test-context';

import { useSupabase } from 'components/context/supabase-context';
import {User} from '@supabase/supabase-js';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { UserResponse } from '@supabase/supabase-js';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    // const {msg} = useContext<TestContextType>(TestContext);
    // console.log(msg)
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (children)}
      </div>
    );
  }


const DisplayTabs = ({paperId} : {paperId:number}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [value, setValue] = useState(0);
    const {supabase} = useSupabase();
    const [user, setUser] = useState<User | null>(null);

 
      const loadUser = async () => {
        const {data: {user}} = await supabase.auth.getUser();
        console.log("User is...", user);
        setUser(user);
      }

     useEffect(()=> {

      loadUser();

      const {data} = supabase.auth.onAuthStateChange((event, session) => {
        console.log("display-tabs::updating user", session)
        if (session && session.user){
          setUser(session.user);
        } else {
          console.log("Setting user to null");
          setUser(null);
        }
      });

      return ()=> {
        data.subscription.unsubscribe();
      }

     }, []) 

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log("Changing")
        setValue(newValue);
    };

    return <>
       
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Questions" {...a11yProps(0)} />
            <Tab label="Resources" {...a11yProps(1)} />
            <Tab label="File" {...a11yProps(2)} />
            </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
            { // ts-expect-error Server Component 
             user && <DisplayQuestions paperId={paperId} user={user} />
            }
        </TabPanel>
        <TabPanel value={value} index={1}>
            {// @ts-ignore
                    }
                    {
                    // <DisplayResources paperId={paperId} profile={profile}/>
                    }
        </TabPanel>
        <TabPanel value={value} index={2}>
        { // ts-expect-error Server Component 
                          // <DisplayFiles paperId={parseInt(paperId)}/> 
                        }
        </TabPanel>
    </>
}

export default DisplayTabs;