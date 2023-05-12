import styles from "./page.module.css";

import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {headers, cookies} from 'next/headers';

import Link from 'next/link';
import CardButton from "./card-button";

type ProfileProps = {}

const MainPage = async () => {

  const supabaseUrl:string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey:string = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

  const supabase = createServerComponentSupabaseClient({
    supabaseUrl,
    supabaseKey,
    headers,
    cookies
  });

  const {data: {session}} = await supabase.auth.getSession()

  const {data: papers, error} = await supabase.from("Papers").select();
  
  error && console.error(error);

    if (!session || !(session.user)){
      return <>
      <h1>User not logged in.</h1>
      </>
    }

    return (
        <>
          <div>
            <CardButton title={'Dashboard'} href={`/app/dashboard/${session?.user.id}`}/>
          </div>
        </>
    )
}

export default MainPage;











