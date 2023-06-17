
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
                <LessonTask>1. Complete Log On Tests.</LessonTask>
                <LessonTask>2. Learn the Behaviour Protocols.</LessonTask>
                <LessonTask>3. Complete the lesson formative.</LessonTask>
                <LessonTask>4. Complete the <Link target="new" href="https://forms.office.com/Pages/ResponsePage.aspx?id=Z-j3EwRiEkCb7LTG7zm2qhSDgWep68xPjl4ukGWFgg5UMlJBRjExRTdFODJJMEIzRjE4RUM4V0ZHRy4u">Baseline Survey</Link>.</LessonTask>
            </LessonTasks>

            <LessonSection>
                <LessonSectionTitle>Starter</LessonSectionTitle>
                <LessonSectionContent>
                   
                <MCQ  
                    path={path}  
                    id={`starter`}
                    content={<h1>This is the <u>content</u> </h1>} 
                    answers={[
                        {id: 0, text: "Answer 1", isCorrect: false},
                        {id: 1, text: "Answer 2", isCorrect: true},
                    ]}
                    showLastAnswer={true}
                    showCorrectAnswer={true}
                    
                    />
                    
                </LessonSectionContent>
            </LessonSection>


            <LessonSection>
                <LessonSectionTitle>1. Log On Tests</LessonSectionTitle>
                <LessonSectionContent>
                    <ul>
                        <li>Log In to office.com</li>
                        <ul>
                            <li>Visit <Link target="new" href="https://office.com">https://office.com</Link></li>
                            <li>Use <b>sleroy</b> (my computer login name) -&gt; <b>sleroy@bisak.org</b></li>
                            <li>Use the same password as your computer login.</li>
                        </ul>
                        <div>&nbsp;</div>
                        <li>Log in to Teams</li>
                        <ul>
                            <li>Within office.com, open Teams</li>
                            <LessonImage alt="Teams logo" src="/lessons/ks3-computing/induction/1-introduction/teams-logo.png" width={60} height={60}/>
                            <li>Confirm that you are a member of the correct team.</li>
                            <li>Post a &quot;Hello&quot; message to the general channel.</li>
                        </ul>
                        <div>&nbsp;</div>
                        <li>Log in to Formative</li>
                        <ul>
                            <li>Visit <Link target="new" href="https://www.formative.com">https://www.formative.com</Link></li>
                            <li>Log in using the microsoft button</li>
                            <div><LessonImage alt="formative-logo" width={100} height={100} src="/lessons/ks3-computing/induction/1-introduction/formative-login.png" /></div>
                            <li>Check that you are a member of the correct classes</li>
                        </ul>
                    </ul>

                    <MCQ  
                    path={path}  
                    id={`section-1`}
                    content={<h1>Completed </h1>} 
                    answers={[
                        {id: 0, text: "Yes", isCorrect: true},
                        {id: 1, text: "Not Yet", isCorrect: false},
                    ]}
                    showLastAnswer={true}
                    showCorrectAnswer={true}
                    />
                </LessonSectionContent>
            </LessonSection>

            <LessonSection>
                <LessonSectionTitle>Lab Rules</LessonSectionTitle>
                <LessonSectionContent>
                    <div>A protocol is a way of doing things that everyone understands.  Saying &quot;Good Morning&quot; is a protocol.  These are the protocols for Computing Lessons.</div>
                    <LessonImage alt="5Bs" src="/lessons/ks3-computing/induction/1-introduction/lab-rules.png" width={600} height={350}/>
                </LessonSectionContent>
            </LessonSection>


            <LessonSection>
                <LessonSectionTitle>5P&apos;s & 5B&apos;s</LessonSectionTitle>
                <LessonSectionContent>
                    <div>The following image shows the 5B&apos;s, which describe the places that we can look to get help.</div>
                    <LessonImage alt="5Bs" src="/lessons/ks3-computing/induction/1-introduction/5Bs.png" width={600} height={350}/>
                    
                    <div>The following image shows the 5P&apos;s, which describe the behaviours we expect from all pupils during the lessons.</div>
                    <LessonImage alt="5Ps" src="/lessons/ks3-computing/induction/1-introduction/5Ps.png" width={600} height={400}/>
                    <div>Open Formative</div>
                    <ul>
                        <li>Open formative <Link href="https://app.formative.com/formatives/632085788749f642d271cfbc">Induction - 1. Introduction</Link></li>                   
                        <li>Complete the section 5B&apos;s and 5P&apos;s</li>
                    </ul>
                </LessonSectionContent>
            </LessonSection>

            <LessonSection>
                <LessonSectionTitle>Induction Survey</LessonSectionTitle>
                <LessonSectionContent>
                    <ul>
                        <li>Complete the survey <Link target="new" href="https://forms.office.com/Pages/ResponsePage.aspx?id=Z-j3EwRiEkCb7LTG7zm2qhSDgWep68xPjl4ukGWFgg5UMlJBRjExRTdFODJJMEIzRjE4RUM4V0ZHRy4u">here</Link></li>
                        <li>Work with your buddy to learn the 5B&apos;s and 5P&apos;s. <u>You will be tested</u>.</li>
                    </ul>
                </LessonSectionContent>
            </LessonSection>

        </LessonPage>
    </>
}

export default Page;