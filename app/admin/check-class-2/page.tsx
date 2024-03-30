import { createSupabaseServerClient } from "app/utils/supabase/server";
import Link from 'next/link';

const Page =async () => {

    const loadData = async () => {
        try{

            const supabase = createSupabaseServerClient(false);

            if (!supabase){
                throw new Error("Supabase not created")
            }

        const {data, error} = await supabase.from("Classes").select("id, tag, title")
        
        if (error){
            throw(error.message);
        } 



        return data;

        } catch(error){
            console.error(error);
            return <div>Error: error</div>
        } 
        
    }

    
    const classes = await loadData();

    return <>
        <h1>Check Class Details</h1>
        <Link href="/admin/check-class-2/2"></Link>
        {Array.isArray(classes) && classes.map((c, i) => <div key={i}>
            <a  href={`/admin/check-class-2/${c.tag}`}>{c.title}</a>
        </div>
        )
        }
        
        </>
}


export default Page;