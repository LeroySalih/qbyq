
import {createSupabaseServerClient} from "app/utils/supabase/server"


import DisplayPapers from "./display-papers";

const Page = async ({params} : {params: {classid: string}}) => {

    const {classid} = params;

    const supabase = createSupabaseServerClient()


    const nullSort = (a: any, b: any, compareField: (a: any) => any) => {

        if (compareField(a) == compareField(b)){
            return 0;
        }

        if (compareField(a) == null) {
            return 1;
        }

        if (compareField(b) == null) {
            return -1;
        }

        return (compareField(a) > compareField(b) ? 1 : -1)

    }

    if (!supabase) {
        return;
    }

    const {data, error} = await supabase.rpc("fn_admin_get_all_papers_for_class_spec", {classTag: classid})

    const sortedData = data.sort((a: any, b: any) => nullSort(a, b, (a) => a.availablefrom));



    error && console.error(error);

    return <>
        <h1>Assign Papers Page</h1>
        <DisplayPapers classTag={classid} papers={sortedData}/>
    </>
}

export default Page;