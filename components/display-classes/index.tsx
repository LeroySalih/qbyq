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
                                            <div >
                                            {
                                                /*
                                                // @ts-ignore */}
                                            { c!.Classes!.ClassPapers.map((cp, i) => <div  key={i}>
                                                            <Link className="classLink" href={`/paper-form/${cp.paperId}`}>
                                                               <span className="classLink"> {cp.paperId} { cp.Papers.title} - {cp.Papers.paper} ( {cp.Papers.year})</span>
                                                            </Link>
                                                        </div>)
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

            
            
        `}</style>
  </>
}

export default DisplayClasses;