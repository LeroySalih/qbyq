
import {LessonPage, LessonTitle, LessonObjective, LessonTasks, LessonTask, LessonSection, LessonSectionTitle, LessonSectionContent, LessonImage} from 'components/lesson-page';
import {MCQ} from "components/question-pad";
import QuestionSummary from 'components/question-pad/question-summary';

import Link from 'next/link';

const Page = () => {
    
    const path = `ks3-computing/induction/1-introduction`
    return <>
        <QuestionSummary path={path}/>
        <LessonPage>
            <LessonTitle>1. Introductions</LessonTitle>
            <LessonObjective>LO: TBAT complete induction activities</LessonObjective>
            <LessonObjective>LO: TBAT describe the key behaviours expected within the Computing Lab</LessonObjective>
            
            <LessonTasks>
                <LessonTask>0. Starter</LessonTask>
                <LessonTask>1. What is Cloud Computing?</LessonTask>
                <LessonTask>1. What is OneDrive?</LessonTask>
                <LessonTask>2. Why use OneDrive?</LessonTask>
                <LessonTask>3. How do I access my files to OneDrive?</LessonTask>
                <LessonTask>3. How do I upload files to OneDrive?</LessonTask>
                
            </LessonTasks>

            <LessonSection>
                <LessonSectionTitle>Starter</LessonSectionTitle>
                <LessonSectionContent>
                    <h3>What is the cloud?</h3>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/TTNgV0O_oTg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/_a6us8kaq0g" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    
                    <h3>What is OneDrive?</h3>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/x_n3OD1AsaE" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>

                </LessonSectionContent>
            </LessonSection>

        
            <LessonSection>
                <LessonSectionTitle>1. What is OneDrive</LessonSectionTitle>
                <LessonSectionContent>
                </LessonSectionContent>
            </LessonSection>


        </LessonPage>
        </>
}


export default Page;
