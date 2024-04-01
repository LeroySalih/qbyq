import { createSupabaseServerClient } from "app/utils/supabase/server";



const loadUserDetails = async (pupilId: string) => {

    const supabase = createSupabaseServerClient(false);

    if (!supabase){
        throw Error("Supabase not created")
    }

    const {data, error} = await supabase.from("Profile").select("id, firstName, familyName")
                                        .eq("id", pupilId)
                                        .returns<{
                                            id: number, 
                                            firstName: string, 
                                            familyName: string
                                        }[]>();
    
    if (error) {
        throw (error.message);
    } 

    return data[0];
}

const getHeader = async (pupilId: string) => {

    const user = await loadUserDetails(pupilId);

    return <h1>{user && user.firstName} {user &&  user.familyName}</h1>
}

export default getHeader;