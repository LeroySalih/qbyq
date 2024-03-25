import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "app/utils/supabase/server";

export async function GET(request: Request, {params} : {
    params: {userid : string, filepath : string}
    }
    ) {

    const supabase= createSupabaseServerClient(false);

    if (!supabase){
        console.error("Couldn't create supabase");
        return;
    }

    const {userid, filepath} = params;
    
    
    const file = await supabase.storage.from("work-queue").download(`${userid}/${filepath}`)

    const {data, error} = await supabase.from("Profile").select("id, firstName, familyName").eq("id", userid).maybeSingle();

    error && console.error(error);
    const {firstName, familyName} = data || {firstName : "Not known", familyName: "Not known"};

    if (!file || !file.data)
        return NextResponse.json({status: false, msg:"Create Failed"});

    const response = new NextResponse(file.data)

    response.headers.set('content-type', file.data.type);
    response.headers.append("content-disposition", `attachment; filename="${firstName}-${familyName}-${filepath}"`)

    return response;
}