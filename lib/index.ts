import supabase from "app/utils/supabase/client";
import {User} from "@supabase/supabase-js";
import {Profile} from "./types";


export const getClassesForPupil = async (id: string) => {

    return await supabase.from("ClassMembership")
            .select("pupilId, Classes(id, tag, title, ClassPapers(paperId, availableFrom, completeBy, markBy, Papers(month, year, title, paper, specId, Spec(title))))")
            .eq("pupilId", id);
            
}

export const getProfile = async (id: string): Promise<Profile | null> => {

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
    const {data, error} = await supabase
                    .rpc("fn_pupil_marks_for_all_papers", {_userid: userId});

    error && console.error(error);

    return data;

}


export const getClassByTag = async (tag: string | undefined) => {
    if (tag === undefined)
        return undefined;

    const {data, error} = await supabase.from("Classes")
            .select()
            .eq("tag", tag)
            .single();
  
    error && console.error(error);
  
    return data;
}


export const getAllSpecs = async () => {
    const {data, error} = await supabase.from("Spec")
            .select()
            .neq("id", 0);

    error && console.error(error);

    
    return data;

}

export const getPaper = async (paperId: number) => {

    const {data, error} = await supabase.from("Papers")
            .select()
            .eq("id", paperId);

    error && console.error(error);

    
    return data;

}

export const getQuestionsForPaper = async (paperId: number) => {

    const {data, error} = await supabase.from("Questions")
            .select()
            .eq("PaperId", paperId)
            .order("question_order");

    error && console.error(error);

    
    return data;

}

export const getSpecItemsForSpec = async (specId: number) => {

    const {data, error} = await supabase.from("SpecItem")
            .select()
            .eq("specId", specId);

    error && console.error(error);

    
    return data;

}


export type GetClassesForPupilResponseType = Awaited<ReturnType<typeof getClassesForPupil>>
export type GetProfileResponseType = Awaited<ReturnType<typeof getProfile>>

export type GetAllPupilMarks = Awaited<ReturnType<typeof getAllPupilMarks>>
export type GetClassByTagResponseType = Awaited<ReturnType<typeof getClassByTag>>

export type GetAllSpecsType = Awaited<ReturnType<typeof getAllSpecs>>
export type GetPaperType = Awaited<ReturnType<typeof getPaper>> 
export type GetSpecItemsForSpecType = Awaited<ReturnType<typeof getSpecItemsForSpec>> 








