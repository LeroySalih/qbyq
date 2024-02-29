


import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {headers, cookies} from 'next/headers';
import { redirect } from 'next/navigation'
import Link from 'next/link';

import Nav from './nav';

const Page = async () => {

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

    return <>
    <h1>Test Page</h1>
    
    
    <pre>{session && JSON.stringify(session, null, 2)}</pre>
    <pre>{papers && JSON.stringify(papers, null, 2)}</pre>
    </>
}

export default Page;