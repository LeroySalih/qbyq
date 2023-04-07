import supabase from "components/supabase";

export const getClasses = async (userId: string) => {
    const {data, error} = await supabase.from("ClassMembership")
            .select("pupilId, Classes(id, tag, title, ClassPapers(paperId, availableFrom, completeBy, markBy, Papers(month, year, title, paper, specId, Spec(title))))")
            .eq("pupilId", userId);
            
  
    error && console.error(error);
  
    return data;
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

    console.log("Specs", data)
    return data;

}

export const getPaper = async (paperId: number) => {

    const {data, error} = await supabase.from("Papers")
            .select()
            .eq("id", paperId);

    error && console.error(error);

    console.log("Paper", data)
    return data;

}

export const getQuestionsForPaper = async (paperId: number) => {

    const {data, error} = await supabase.from("Questions")
            .select()
            .eq("PaperId", paperId)
            .order("question_order");

    error && console.error(error);

    console.log("Questions", data)
    return data;

}

export const getSpecItemsForSpec = async (specId: number) => {

    const {data, error} = await supabase.from("SpecItem")
            .select()
            .eq("specId", specId);

    error && console.error(error);

    console.log("Specitems", data)
    return data;

}

export type GetAllPupilMarks = Awaited<ReturnType<typeof getAllPupilMarks>>
export type GetClassByTagResponseType = Awaited<ReturnType<typeof getClassByTag>>
export type GetClassesResponseType = Awaited<ReturnType<typeof getClasses>>
export type GetAllSpecsType = Awaited<ReturnType<typeof getAllSpecs>>
export type GetPaperType = Awaited<ReturnType<typeof getPaper>> 
export type GetSpecItemsForSpecType = Awaited<ReturnType<typeof getSpecItemsForSpec>> 





