import styles from "./page.module.css";
import { createSupabaseServerClient } from "./utils/supabase/server";
import { redirect } from 'next/navigation'
import Dashboard from "./dashboard";
import SignIn from "./signin-panel";
import { DateTime } from "luxon";

import {getUser, getProfile} from "../lib/server";



const MainPage = async () => {

  const supabase = createSupabaseServerClient(false);
  
  if (!supabase) {
    return <h1>Error: Creating supabase. </h1>
  }

  let user = await getUser(0);

  if (user === null){
    user = await getUser(1000);
  }



  if (user !== null) {

    const profile = await getProfile(user.id);

    //redirect(`/app/spec-report/${user.id}`);
    if (profile === null){
      redirect('/app/new-profile')
    }
    
    return <Dashboard profile={profile}/>

  } else {
    return <>
    <SignIn />
    
    </>
  }

}

export default MainPage;














