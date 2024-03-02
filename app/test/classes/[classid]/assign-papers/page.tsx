
import {createSupabaseServerClient} from "app/utils/supabase/server"


import DisplayPapers from "./display-papers";

const Page = async ({params} : {params: {classid: string}}) => {

    const {classid} = params;

    const supabase = createSupabaseServerClient()

    const {data, error} = await supabase.rpc("fn_admin_get_all_papers_for_class_spec", {classTag: classid})

    error && console.error(error);

    return <>
        <h1>Assign Papers Page</h1>
        <DisplayPapers classTag={classid} papers={data}/>
    </>
}

export default Page;