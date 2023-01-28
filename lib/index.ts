import supabase from "components/supabase";

export const getClasses = async (userId: string) => {
    const {data, error} = await supabase.from("ClassMembership")
            .select("pupilId, Classes(id, tag, title, resources)")
            .eq("pupilId", userId);
  
    error && console.error(error);
  
    return data;
}

export type GetClassesResponseType = Awaited<ReturnType<typeof getClasses>>





