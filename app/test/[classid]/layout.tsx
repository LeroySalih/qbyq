import Link from "next/link"

export default function TestLayout({children, params}: {children: React.ReactNode, params: {classid : string}}) {

    const {classid} = params;
    return (
        <>
            <Link href={`/test/${classid}`}>Summary</Link> | &nbsp;
            <Link href={`/test/${classid}/assign-papers`}>Assign papers</Link> | &nbsp;
            <Link href={`/test/${classid}/pupil-reports`}>Pupils</Link> | &nbsp;
            {children}
            
        </>
    )
}