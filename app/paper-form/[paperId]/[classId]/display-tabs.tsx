"use client";
import { TabView, TabPanel } from 'primereact/tabview';
import DisplayQuestions from './display-questions';
import DisplayFiles from './display-files';
import DisplayResources from "./display-resources";
import { useEffect , useState, useContext} from "react";
import { UserContext } from "components/context/user-context";

const DisplayTabs = ({paperId} : {paperId:number}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const {profile} = useContext(UserContext);

    return <>
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                
                <TabPanel header="Questions" >
                    <DisplayQuestions paperId={paperId}/>
                </TabPanel>
            
                <TabPanel header="Resources">
                    {// @ts-ignore
                    <DisplayResources paperId={paperId} profile={profile}/>
                    }
                </TabPanel>

                <TabPanel header="Files">        
                        {/* @ts-expect-error Server Component */}
                        <DisplayFiles paperId={parseInt(paperId)}/> 
                </TabPanel>
                
        </TabView>
    </>
}

export default DisplayTabs;