"use server";
import {DateTime} from "luxon"
import {createSupabaseServerClient} from "app/utils/supabase/server"


const updateData = async (classTag: string, paperId: string, updateObject: {[key: string]: string | Date} ) => {
    
    if ("completeBy" in updateObject){
        updateObject["markBy"] = DateTime.fromISO(updateObject["completeBy"] as string).plus({days: 3}).toJSDate();
    }

    if ("availableFrom" in updateObject){
        
        updateObject["completeBy"] = DateTime.fromISO(updateObject["availableFrom"] as string).plus({days: 4}).toJSDate();
        updateObject["markBy"] = DateTime.fromISO(updateObject["availableFrom"] as string ).plus({days: 7}).toJSDate();
    }


    //const availableFrom = availableFromStr && DateTime.fromISO(availableFromStr)
    // const completeBy = availableFrom && availableFrom.plus({days: 4}) || null;
    // 3const markBy = availableFrom && availableFrom.plus({days: 6}) || null;
    
    // const cookieStore = cookies()
    const supabase = createSupabaseServerClient()

    if (!supabase) {
        return;
    }

    const {data : classId, error} = await supabase.from("Classes").select("id").eq("tag", classTag).maybeSingle();
         
    // @ts-ignore
    updateObject["paperId"] = paperId;
    updateObject["classId"] = classId?.id;



    const {data: upsertData, error: upsertError} = await supabase.from("ClassPapers").upsert(updateObject).select("*");

    upsertError && console.error(upsertError);

}


export default updateData;
