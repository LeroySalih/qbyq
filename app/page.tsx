import styles from "./page.module.css";

import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {headers, cookies} from 'next/headers';
import Link from 'next/link';

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

    return (
        <>
          <div className={styles.page}>
          <div className={styles.leftPanel}>Side Bar</div>
          <div className={styles.rightPanel}>
            {papers && <div>There are currently {papers.length} {papers.length == 1 ? 'paper' : 'papers'} available.</div>}
          </div>
          <div>
            <h1>Session Data</h1>
            {
                JSON.stringify(session?.user.id, null, 2)
            }
            {session && <Link href={`/app/dashboard/${session?.user.id}`}><span>Dashboard</span></Link>}
            </div>
          </div>
        </>
    )
}

export default MainPage;











