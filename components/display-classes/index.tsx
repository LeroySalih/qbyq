import { GetClassesResponseType, GetAllPupilMarks } from "lib";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { UserContextType, UserContext } from 'components/context/user-context';

type DisplayClassesParams = {
    classes : GetClassesResponseType,
    pupilMarks :GetAllPupilMarks
}

const DisplayClasses = ({classes, pupilMarks}:DisplayClassesParams) => {

    const {profile} = useContext<UserContextType>(UserContext);

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
                classes?.map((c, i) => <div key={`${i}-${c?.Classes?.title}`} className="display-class">
                                            
                                            <div className="class-title-block">
                                                {
                                                    /*
                                                // @ts-ignore */}
                                                <div className="classTitle">{c?.Classes?.title} ({c?.Classes?.tag})</div>
                                                <div>
                                                    {// @ts-ignore
                                                    profile && <Link href={`/spec-report/${profile.id}/${c!.Classes!.ClassPapers[0].Papers.specId}`}>
                                                    <span className="classTitle">{
                                                    // @ts-ignore
                                                    c!.Classes!.ClassPapers[0].Papers.Spec.title}
                                                    </span>
                                                    </Link>}
                                                </div>
                                            </div>
                                            <div className="display-papers">
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
                                                    <Link className="classLink" href={`/paper-form/${cp.paperId}`}>
                                                        <span className="classLink">{cp.Papers.year}-{cp.Papers.month}</span>
                                                    </Link>
                                                </div>
                                                
                                                <div  key={`1${i}`}>
                                                    <Link className="classLink" href={`/paper-form/${cp.paperId}`}>
                                                        <span className="classLink">{cp.Papers.paper}</span>
                                                    </Link>

                                                </div>
                                            
                                                <div key={`2${i}`}>
                                                    <Link className="classLink" href={`/paper-form/${cp.paperId}`}>
                                                        <span className="classLink">{ cp.Papers.title}</span>
                                                    </Link>     
                                                </div>
                                                <div className="classLink">{cp.availableFrom.substr(0,10)}</div>
                                                
                                                {profile && profile.isAdmin && 
                                                     // @ts-ignore
                                                    <Link href={`/admin/check-paper-marks-for-class/${c!.Classes!.id}/${cp.paperId}`}><div className="classLink">{cp.completeBy.substr(0,10)}</div></Link> }
                                                {profile && !profile.isAdmin && <div className="classLink">{cp.completeBy.substr(0,10)}</div> }
                                                
                                                <div className="classLink">{cp.markBy.substr(0,10)}</div>
                                                
                                                <div key={`3${i}`} className="classLink">
                                                    {getMarksForPaper(cp.paperId)}
                                                </div>
                                                </>)
                                                }
                                            </div>
                                        </div>)}
                
            </div>
        
            
        <style jsx={true}>{`

            .display-class {
                border-bottom:solid 1px silver;
                margin-bottom: 2rem;
                
            }

            .class-title-block {
                display: flex;
                flex-direction:row;
                justify-content: space-between;
                align-items: center;
                
            }
            .classTitle {
                font-size: 1.3rem;
                font-weight : bold;
                
                margin-top: 1rem;
            }

            .classLink {
                font-size: 0.7rem;
                
                text-decoration: none;
            }


            .display-papers {
                display : grid;
                grid-template-columns: 1fr 2fr 3fr 1fr 1fr 1fr 1fr;
            }


            
            
        `}</style>
  </>
}

export default DisplayClasses;