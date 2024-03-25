import styles from "./page.module.css";
import { createSupabaseServerClient } from "./utils/supabase/server";
import { redirect } from 'next/navigation'
import Dashboard from "./dashboard";

const MainPage = async () => {

  const supabase = createSupabaseServerClient(false);

  if (!supabase) {
    return <h1>Error: Creating supabase. </h1>
  }

  const {data: {user}} = await supabase.auth.getUser();
  console.log("User Data", user) 

  const {data: {session}} = await supabase.auth.getSession()
  console.log("Session", session)

  if (user) {
    console.log("User detected", user)
    //redirect(`/app/spec-report/${user.id}`);
    return <Dashboard user={user}/>
  } else {
    return <>
    <h1>User not logged in.</h1>
    
    </>
  }

}

export default MainPage;














