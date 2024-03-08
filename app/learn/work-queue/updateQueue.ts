"use server"

import { createSupabaseServerClient } from "app/utils/supabase/server"
import { revalidatePath } from "next/cache";

export const updateQueue =async (userid: string, publicUrl: string, filePath: string, machine: string, notes: string) => {
    
    const supabase = createSupabaseServerClient(true);

    if (!supabase){
        return {status: false, msg: "Supabase create failed"}
    }

    const {data, error} = await supabase?.from("WorkQueue").insert({userid, publicUrl, filePath, machine, notes}).select();

    error && console.error(error);
    revalidatePath(`/learn/work-queue`);

    return {status: true, data}
}


