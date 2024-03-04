
import {CreateForm} from "./create-form";
import {createSupabaseServerClient} from "app/utils/supabase/server";

const Page = async () => {
    
    const supabase = createSupabaseServerClient();

    const {data: papers, error} = await supabase.from("Papers").select("id, year, month, paper, specId")
    const {data: specs, error: specsError} = await supabase.from("Spec").select("id, title")
    const {data: specItems, error: specItemsError} = await supabase.from("SpecItem").select("id, tag, title, SpecId")

    return <CreateForm specs={specs} papers={papers} specItems={specItems}/>
}

export default Page;