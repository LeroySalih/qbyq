import styles from "./page.module.css";
import { createSupabaseServerClient } from "./utils/supabase/server";
import { redirect } from 'next/navigation'


const MainPage = async () => {

  const supabase = createSupabaseServerClient();

  const {data: {user}} = await supabase.auth.getUser();
  console.log("User Data", user) 
  const {data: {session}} = await supabase.auth.getSession()
  
  console.log("Session", session)

  const {data: papers, error} = await supabase.from("Papers").select();
  
  error && console.error(error);

  if (user) {
    console.log("User detected", user)
    redirect(`/app/spec-report/${user.id}`);
  } else {
    return <>
    <h1>User not logged in.</h1>
    </>
  }

}

export default MainPage;














