import supabase from "components/supabase";

export const getClasses = async (userId: string) => {
    const {data, error} = await supabase.from("ClassMembership")
            .select("pupilId, Classes(id, tag, title, ClassPapers(paperId, Papers(month, year, title, paper)))")
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

export type GetAllPupilMarks = Awaited<ReturnType<typeof getAllPupilMarks>>
export type GetClassByTagResponseType = Awaited<ReturnType<typeof getClassByTag>>
export type GetClassesResponseType = Awaited<ReturnType<typeof getClasses>>





