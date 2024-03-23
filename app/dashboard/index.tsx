
import {User} from "@supabase/supabase-js";
import Link from "next/link";

const Dashboard = ({user}  : {user: User}) => {
    return<>
    <h1>User: {user.id}</h1>
    <div><Link href={`app/spec-report/${user.id}`}>Past Papers</Link></div>
    <div><Link href="/learn/gpt/4/1">Daily Question</Link></div>
    </>
}

export default Dashboard;