/* Server Component */
import { GetClassesResponseType, GetAllPupilMarks } from "lib";

import Link from "next/link";
import { Profile } from "types/alias";
import styles from "./display-classes.module.css";

type DisplayClassesParams = {
    profile : Profile,
    classes : GetClassesResponseType,
    pupilMarks :GetAllPupilMarks
}

const DisplayClasses = ({profile, classes, pupilMarks}:DisplayClassesParams) => {

    // const {profile} = useContext<UserContextType>(UserContext);

    console.log("Class Data", classes)
    const getMarksForPaper = (paperId: number) => {
        // @ts-ignore
        const filtered = pupilMarks && pupilMarks.filter(pm => pm.paperId == paperId)
        // @ts-ignore
        return filtered && filtered.length > 0 ? ((filtered[0].marks / filtered[0].max_marks) * 100).toFixed(0) + "%": null;
    }
    
    return <>
        
            <div >
                {/*
                 // @ts-ignore */
                classes?.map((c, i) => <div key={`${i}-${c?.Classes?.title}`} className={styles['display-class']}>                  
                    <div className={styles['class-title-block']}>
                        <div className={styles['classTitle']}>
                            { /*
                        // @ts-ignore */}
                            {profile?.isAdmin && <Link href={`admin/check-class/${c?.Classes?.id}`}>{c?.Classes?.title}</Link> }
                            { /*
                        // @ts-ignore */}
                            {!profile?.isAdmin && c?.Classes?.title }
                            </div>
                        <div>
                            {// @ts-ignore
                            profile && <Link href={`/spec-report/${profile.id}/${c!.Classes!.ClassPapers[0].Papers.specId}`}>
                            <span className={styles['classTitle']}>{
                            // @ts-ignore
                            c!.Classes!.ClassPapers[0].Papers.Spec.title}
                            </span>
                            </Link>}
                        </div>
                    </div>
                    <div className={styles['display-papers']}>
                        <div>Date</div>
                        <div>Code</div>
                        <div>Title</div>
                        <div>Issued</div>
                        <div>Complete By</div>
                        <div>Mark By</div>
                        <div>Marks</div>
                    {
                        /*
                        // @ts-ignore */}
                    { c!.Classes!.ClassPapers
                        .filter((cp:any) => {return cp.availableFrom.substr(0,10) <= new Date().toISOString().substr(0,10)})
                        .sort((a:any, b:any) => a.availableFrom > b.availableFrom ? -1 : 1)
                        .map((cp:any, i:number) => <>
                        <div  key={`0${i}`}>
                            <Link   className={styles['classLink']} 
                                    href={`/paper-form/${cp.paperId}`}>
                                    <span 
                                        className={styles['classLink']}>
                                            {cp.Papers.year}-{cp.Papers.month}
                                    </span>
                            </Link>
                        </div>
                        
                        <div  key={`1${i}`}>
                            <Link className={styles['classLink']} 
                                href={`/paper-form/${cp.paperId}`}>
                                <span className={styles['classLink']}>
                                    {cp.Papers.paper}
                                </span>
                            </Link>

                        </div>
                    
                        <div key={`2${i}`}>
                            <Link className={styles['classLink']} 
                                    href={`/paper-form/${cp.paperId}`}>
                                <span className={styles['classLink']}>
                                    { cp.Papers.title}
                                </span>
                            </Link>     
                        </div>
                        
                        <div className={styles['classLink']}>
                            {cp.availableFrom.substr(0,10)}
                        </div>
                        
                        {profile && profile.isAdmin && 
                                // @ts-ignore
                            <Link href={`/admin/check-paper-marks-for-class/${c!.Classes!.id}/${cp.paperId}`}>
                                <div className="classLink">{cp.completeBy.substr(0,10)}</div>
                            </Link> 
                        }
                        {
                            profile && !profile.isAdmin && 
                            <div className={styles['classLink']}>
                                {cp.completeBy.substr(0,10)}
                            </div> 
                        }
                        
                        <div className={styles['classLink']}>
                            {cp.markBy.substr(0,10)}
                        </div>
                        
                        <div key={`3${i}`} className={styles['classLink']}>
                            {getMarksForPaper(cp.paperId)}
                        </div>
                        </>)
                        }
                    </div>
                </div>)}
            </div>
  </>
}

export default DisplayClasses;