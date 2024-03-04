"use server";
import {DateTime} from "luxon"
import {createSupabaseServerClient} from "app/utils/supabase/server"


const updateData = async (classTag: string, paperId: string, availableFromStr: string | null) => {
    
    const availableFrom = availableFromStr && DateTime.fromISO(availableFromStr)
    const completeBy = availableFrom && availableFrom.plus({days: 4}) || null;
    const markBy = availableFrom && availableFrom.plus({days: 6}) || null;
    
    // const cookieStore = cookies()
    const supabase = createSupabaseServerClient()

    if (!supabase) {
        return;
    }

    const {data : classId, error} = await supabase.from("Classes").select("id").eq("tag", classTag).maybeSingle();
         
    const {data: upsertData, error: upsertError} = await supabase.from("ClassPapers").upsert({
        paperId: paperId,
        classId: classId?.id,
        availableFrom,
        completeBy,
        markBy
    }).select("*");

    upsertError && console.error(upsertError);

    
}


export default updateData;
