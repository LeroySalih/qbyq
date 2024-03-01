import styles from "./page.module.css";
import { createSupabaseServerClient } from "./utils/supabase/server";
import { redirect } from 'next/navigation'


type ProfileProps = {}

const MainPage = async () => {

  //const supabaseUrl:string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // const supabaseKey:string = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

  //const cookieStore = cookies()
  //const supabase = createServerComponentClient({ cookies: () => cookieStore }, {supabaseUrl, supabaseKey})
  const supabase = createSupabaseServerClient();

  const {data: {session}} = await supabase.auth.getSession()

  const {data: papers, error} = await supabase.from("Papers").select();
  
  error && console.error(error);

    if (!session || !(session.user)){
      return <>
      <h1>User not logged in.</h1>
      </>
    }

    redirect(`/app/spec-report/${session.user.id}`);

    return (
        <>
        </>
    )
}

export default MainPage;


const DisplayClass = ({title} : {title: string}) => {
  return <div className={styles.displayClass}>
            <div>
              <h3 >{title}</h3>
              <div className={styles.statsContainer}>
              <div className={styles.flashCardContainer}>
                <img src="icons/bar-chart.png" width="25" height="25" alt="flash"/>
                <a href="https://3000-leroysalih-qbyq-kkgf0kw9w4v.ws-us99.gitpod.io/app/spec-report/0d65c82d-e568-450c-a48a-1ca71151e80f?classid=2">78%</a> 
              </div>

              <div className={styles.flashCardContainer}>
                <img src="icons/flash-cards.png" width="25" height="25" alt="flash"/>
                <a href="https://3000-leroysalih-qbyq-kkgf0kw9w4v.ws-us99.gitpod.io/app/flashcards">25%</a> 
              </div>
              
              </div>
            </div>
            
            <hr/>
            
            <div className={styles.paperDueGrid}>
              <div>Paper</div>
              <div>Complete By:</div>
              <div>Mark By:</div>
              <div><a href="/app/paper-form/6/2">4IT01/01</a></div>
              <div>23-04-28</div>
              <div>23-04-30</div>
              <div><a href="/app/paper-form/6/2">4IT01/02</a></div>
              <div>23-04-28</div>
              <div>23-04-30</div>
            </div>
            <div>See All</div>
         </div>
}











