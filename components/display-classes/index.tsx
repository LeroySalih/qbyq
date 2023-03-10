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
                {/*
                 // @ts-ignore */
                classes?.map((c, i) => <div key={`${i}-${c?.Classes?.title}`}>
                                            {
                                                /*
                                            // @ts-ignore */}
                                            <div className="classTitle">{c?.Classes?.title} ({c?.Classes?.tag})</div>
                                            <div className="display-papers">
                                                <div>Date</div>
                                                <div>Code</div>
                                                <div>Title</div>
                                                <div>Available</div>
                                                <div>Marks</div>
                                            {
                                                /*
                                                // @ts-ignore */}
                                            { c!.Classes!.ClassPapers
                                                .filter((cp:any) => {return cp.availableFrom.substr(0,10) <= new Date().toISOString().substr(0,10)})
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
                                                <div key={`3${i}`} className="classLink">
                                                    {getMarksForPaper(cp.paperId)}
                                                </div>
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
                grid-template-columns: 1fr 2fr 3fr 1fr 1fr;
            }


            
            
        `}</style>
  </>
}

export default DisplayClasses;