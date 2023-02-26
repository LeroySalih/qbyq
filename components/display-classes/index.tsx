import { GetClassesResponseType, GetAllPupilMarks } from "lib";
import { useEffect, useState } from "react";
import Link from "next/link";

type DisplayClassesParams = {
    classes : GetClassesResponseType,
    pupilMarks :GetAllPupilMarks
}

const DisplayClasses = ({classes, pupilMarks}:DisplayClassesParams) => {

    const getMarksForPaper = (paperId: number) => {
        // @ts-ignore
        const filtered = pupilMarks && pupilMarks.filter(pm => pm.paperId == paperId)
        // @ts-ignore
        return filtered && filtered.length > 0 ? ((filtered[0].marks / filtered[0].max_marks) * 100).toFixed(0) + "%": null;
    }
    return <>
        
            <div>
                {classes?.map((c, i) => <div key={i}>
                                            {
                                                /*
                                            // @ts-ignore */}
                                            <div className="classTitle">{c?.Classes?.title} ({c?.Classes?.tag})</div>
                                            <div className="display-papers">
                                            {
                                                /*
                                                // @ts-ignore */}
                                            { c!.Classes!.ClassPapers.map((cp, i) => <>
                                                <div  key={i}>
                                                            <Link className="classLink" href={`/paper-form/${cp.paperId}`}>{cp.Papers.year}-{cp.Papers.month}</Link>
                                                </div>
                                                
                                                <div  key={i}>
                                                            <Link className="classLink" href={`/paper-form/${cp.paperId}`}>{cp.Papers.paper}</Link>
                                                </div>
                                            
                                                <div>
                                                    <Link className="classLink" href={`/paper-form/${cp.paperId}`}>{ cp.Papers.title}</Link>     
                                                </div>
                                                <div>{getMarksForPaper(cp.paperId)}</div>
                                                </>)
                                                }
                                            </div>
                                        </div>)}
                
            </div>
        
            
        <style jsx={true}>{`

            .classTitle {
                font-size: 1.3rem;
                font-weight : bold;
                border-bottom:solid 1px silver;
                margin-top: 1rem;
            }

            .classLink {
                font-size: 0.8rem;
                
                text-decoration: none;
            }


            .display-papers {
                display : grid;
                grid-template-columns: 1fr 2fr 3fr 1fr;
            }


            
            
        `}</style>
  </>
}

export default DisplayClasses;