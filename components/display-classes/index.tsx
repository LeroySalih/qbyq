import { GetClassesResponseType } from "lib";
import { useEffect, useState } from "react";
import Link from "next/link";
type DisplayClassesParams = {
    classes : GetClassesResponseType
}

const DisplayClasses = ({classes}:DisplayClassesParams) => {

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
                                                            <Link className="classLink" href={`/paper-form/${cp.paperId}`}>{cp.Papers.month}-{cp.Papers.year}</Link>
                                                </div>
                                                
                                                <div  key={i}>
                                                            <Link className="classLink" href={`/paper-form/${cp.paperId}`}>{cp.Papers.paper}</Link>
                                                </div>
                                            
                                                <div>
                                                    <Link className="classLink" href={`/paper-form/${cp.paperId}`}>{ cp.Papers.title}</Link>     
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
                grid-template-columns: 1fr 2fr 3fr;
            }


            
            
        `}</style>
  </>
}

export default DisplayClasses;