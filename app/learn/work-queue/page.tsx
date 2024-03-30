

import { Suspense } from "react";
import CreateTicket from "./create-ticket";
import { createSupabaseServerClient } from "app/utils/supabase/server";
import Link from 'next/link';
import DisplayQueueItems from "./display-queue-items";

import {Ticket, Tickets, Profile} from "./types"
import { Container, Grid } from "@mui/material";

const Page = async () => {

    const supabase = createSupabaseServerClient()

    if (!supabase) {
        return <h1>Error: Creating supabase</h1>
    }

    const userResponse = await supabase?.auth.getUser();
    
    const {user} = userResponse.data;

    if (!user) {
        return <h1>User not signed in</h1>
    }

    

    const {data: profile, error: profileError} = await supabase?.from("Profile")
                            .select("id, isAdmin, isTech")
                            .eq("id", user.id)
                            .maybeSingle()

    if (!profile)
        return <h1>No profile returned</h1>

    profileError &&console.error(profileError)

    return <>
        <h1>Queue Page</h1>
        {user && user?.id && <CreateTicket userid={user?.id}/>}
        {!user && <div>Not signed in</div>}
        <Suspense fallback={<div>Loading</div>}>
            {/* @ts-expect-error Async server Component*/}
            <DisplayQueue profile={profile}/>
        </Suspense>
    </>
}

const DisplayQueue = async ({profile} : {profile: Profile}) => {
    const supabase = createSupabaseServerClient()

    const {id, isAdmin, isTech} = profile;

    if (!supabase) {
        return <div>Error: Supabase creation error</div>
    }

    let data: Tickets, error = null;

    // if the profile is a admin or tech, return all, else only return those matching userid
    let result = null 

    
    const fields = "id, userid, publicUrl, filePath, notes, machine, firstName, familyName, created_at, complete_date, status, isAdmin, isTech, notes, tech_notes";

    if (isAdmin || isTech){
        result = await supabase.from('vw_wq_tickets').select(fields) 
    } else {
        result = await supabase.from('vw_wq_tickets').select(fields).eq("userid", id) 
    }
    data = result.data;
    error = result.error;

    error && console.error(error);
    
    return <Container>
            <Grid>
               <DisplayQueueItems tickets={data} profile={profile} />
            </Grid>
            </Container>
}

export default Page;