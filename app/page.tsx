import styles from "./page.module.css";
import { createSupabaseServerClient } from "./utils/supabase/server";
import { redirect } from 'next/navigation'
import Dashboard from "./dashboard";
import SignIn from "./signin-panel";
import { DateTime } from "luxon";

import {getUser, getProfile} from "../lib/server";

const MainPage = async () => {

  try {

    const supabase = createSupabaseServerClient(false);
  
  if (!supabase) {
    throw new Error("Supbase Server Client didn't return an object.")
  }

  let user = await getUser(0);

  // if the first call to getUser
  if (user === null){
    // if the first call to getUser returns null, try again - it may be that the server needs time to catch up.
    user = await getUser(1000);
  }

  if (user !== null) {
    // if a user has been returned, get the profile.
    const profile = await getProfile(user.id);

    //redirect(`/app/spec-report/${user.id}`);
    if (profile === null){
      redirect('/app/new-profile')
    }
    
    // display the dashboard for this user
    return <Dashboard profile={profile}/>

  } else {
    // display the signin page
    return <>
      <SignIn />
    </>
  }
  } catch(error : any) {
    console.error(DateTime.now(), error);
    return <>
      <h1>An error occured</h1>
      <pre>{JSON.stringify(error.message, null, 2)}</pre>
    </>
  }
}

export default MainPage;