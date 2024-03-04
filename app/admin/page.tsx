
import Link from "next/link";

const Page = async () => {

    return <>
    <h1>Admin Page</h1>
    
        <h1>New Papers</h1>
        <div>Create the questions for an existing paper <Link href="/admin/papers/create">here</Link></div>

        <h1>Class Marks</h1>
        <div>Check the scores that a class has entered for a paper <Link href="/admin/check-class/2">here</Link></div>

    </>
}

export default Page;