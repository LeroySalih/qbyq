
import {createSupabaseServerClient} from "app/utils/supabase/server"

import {cookies} from 'next/headers';

const Page = async () => {

    const supabase = createSupabaseServerClient();

    const {data: {session}} = await supabase.auth.getSession()

    const {data: papers, error} = await supabase.from("Papers").select();

    return <>
    <h1>Test Page</h1>
    
    
    <pre>{session && JSON.stringify(session, null, 2)}</pre>
    <pre>{papers && JSON.stringify(papers, null, 2)}</pre>
    </>
}

export default Page;