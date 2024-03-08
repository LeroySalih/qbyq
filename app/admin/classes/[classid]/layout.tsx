import Link from "next/link"

export default function TestLayout({children, params}: {children: React.ReactNode, params: {classid : string}}) {

    const {classid} = params;
    return (
        <>
            <Link href={`/admin/classes/${classid}`}>Summary</Link> | &nbsp;
            <Link href={`/admin/classes/${classid}/assign-papers`}>Assign papers</Link> | &nbsp;
            <Link href={`/admin/classes/${classid}/pupil-reports`}>Pupils</Link> | &nbsp;
            {children}
             
        </>
    )
}