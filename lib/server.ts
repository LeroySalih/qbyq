// Supabase needs a few seconds to update.  So build a short delay into the getUser function.
import  {createSupabaseServerClient} from "app/utils/supabase/server";
import {User} from "@supabase/supabase-js";
import {Profile} from "./types";

export const getUser = async (delay: number = 0 ): Promise<User | null>  => {

        const supabase = createSupabaseServerClient(false);
  
        if (!supabase) { 
            throw(new Error("GetUser::Cant create supabase.")) 
            return null;
        }
  
        const {data: {user}} = await supabase.auth.getUser();
        
        
        
        return user;
  }


  export const getProfile = async (id: string): Promise<Profile | null> => {

    const supabase = createSupabaseServerClient(false);
  
    if (!supabase) {
        throw(new Error("GetUser::Cant create supabase.")) 
        return null;
    }

    const {data, error} = await supabase.from("Profile")
            .select("id, firstName, familyName")
            .eq("id", id)
            .returns<Profile[]>()

    if (error){
        throw Error(error.message);
        return null;
    }

    if(! data || data.length !== 1){
        return null;
    }

    return data[0];
                    
}

export const getAllPupilMarks = async (userId: string) => {
    const supabase = createSupabaseServerClient(false);
  
    if (!supabase) {
        throw(new Error("GetUser::Cant create supabase.")) 
        return null;
    }
    
    const {data, error} = await supabase
                    .rpc("fn_pupil_marks_for_all_papers", {_userid: userId});

    error && console.error(error);

    return data;

}

