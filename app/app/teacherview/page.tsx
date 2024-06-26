"use client";
import supabase from "app/utils/supabase/client";
import {useEffect} from 'react';

const Page = () => {

    

    useEffect(()=> {
        // cant subscribe to a class, as a pupil will belong to more than 1 class.
        // instead, subscribe to a specItemId, to listen to the activity on that 
        // specItem
        const channel = supabase.channel('22-10BS1');

        channel.on('broadcast', {event: 'QUESTION_ANSWERED'}, (payload) =>  console.info("Question Answered", payload)).subscribe();

    }, []);

    return <h1>Teacher View</h1>
}


export default Page;