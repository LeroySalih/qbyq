
import Link from "next/link";

const Page = async () => {

    return <>
    <h1>Admin Page</h1>
    
        <h2>New Papers</h2>
        <div>Create the questions for an existing paper <Link href="/admin/papers/create">here</Link></div>

        <h2>Class Marks</h2>
        <div>Check the scores that a class has entered for a paper <Link href="/admin/check-class-2">here</Link></div>

        <h2>Class Admin</h2>
        <div>Assign papers to a class <Link href="/admin/classes/23-11CS">here</Link></div>

    </>
}

export default Page;