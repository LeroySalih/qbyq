import { createSupabaseServerClient } from "app/utils/supabase/server"

const loadPaperQuestions = async (pupilId: string, classId: number, paperId: number) => {
 
    try {
        const supabase = createSupabaseServerClient(false);

        if (!supabase){
            throw ("Can not create Supabase client");
        }

        const {data, error} = await supabase.from("Questions")
                                        .select("id, question_number, marks, question_order, SpecItem(tag, title)")
                                        .eq("PaperId", paperId)
                                        .order("question_order")
                                        .returns<{
                                            id: number, 
                                            question_number: string, 
                                            marks: number, 
                                            question_order: number,
                                            SpecItem: {
                                                tag: string,
                                                title: string
                                            }
                                        }[]>();

        if (error){
            throw(error.message);
        }

        return data.map((d, i) => ({
            id: d.id, 
            question_number: d.question_number, 
            marks :d.marks, 
            question_order: d.question_order, 
            tag: d.SpecItem.tag, 
            title: d.SpecItem.title 
        }));


    } catch(error: any) {
        console.error(error.message);
        return [];
    }
    
}


export default loadPaperQuestions;