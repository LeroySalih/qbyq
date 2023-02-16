import supabase from "components/supabase";

export const getClasses = async (userId: string) => {
    const {data, error} = await supabase.from("ClassMembership")
            .select("pupilId, Classes(id, tag, title, ClassPapers(paperId, Papers(month, year, title, paper)))")
            .eq("pupilId", userId);
  
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

export type GetClassByTagResponseType = Awaited<ReturnType<typeof getClassByTag>>
export type GetClassesResponseType = Awaited<ReturnType<typeof getClasses>>





