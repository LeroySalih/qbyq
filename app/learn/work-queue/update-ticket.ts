

"use server"

import { createSupabaseServerClient } from "app/utils/supabase/server"
import { revalidatePath } from "next/cache";
import { DateTime } from 'luxon';

const updateTicket = async (id: number, updateObject: any) => {
    

    const supabase = createSupabaseServerClient(true);

    if (!supabase){
        console.error("Error in creating supabase")
        return;
    }

    const {data, error} = await supabase.from("WorkQueue").update(updateObject).eq("id", id).select();

    error && console.error(error);

    

    

    return;

}

export const ticketInProgress = async (id: number) => {
    updateTicket(id, {status: "in progress"})
    revalidatePath('/learn/work-queue');
}

export const ticketComplete = async (id: number) => {
    updateTicket(id, {status: "completed", complete_date: DateTime.now()})
    revalidatePath('/learn/work-queue');
}


export const ticketWaiting = async (id: number) => {
    updateTicket(id, {status: "waiting", complete_date: null})
    revalidatePath('/learn/work-queue');
}

export const ticketFailed = async (id: number) => {
    updateTicket(id, {status: "failed", complete_date: DateTime.now()})
    revalidatePath('/learn/work-queue');
}

export const ticketTechNotes = async (id : number, text: string) => {
    updateTicket(id, {tech_notes: text})
    revalidatePath('/learn/work-queue');
}

export const ticketRemove = async (id: number) => {
    const supabase = createSupabaseServerClient(true);

    if (!supabase){
        
        return;

    }
    

    const {error} = await supabase?.from("WorkQueue").delete().eq("id", id);

    error && console.error(error);

    revalidatePath('/learn/work-queue');
}