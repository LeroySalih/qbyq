"use server"

import { createSupabaseServerClient } from "app/utils/supabase/server"
import { log } from "console";
import { revalidatePath } from "next/cache";


export const loadPaperMarks = async (pupilId: string, paperId: number) => {
 
    try {
        const supabase = createSupabaseServerClient(false);

        if (!supabase){
            throw ("Can not create Supabase client");
        }

        const {data, error} = await supabase.from("PupilMarks")
                                        .select("id, questionId, marks")
                                        .eq("paperId", paperId)
                                        .eq("userId", pupilId)
                                        .returns<{
                                            id: number, 
                                            questionId: number, 
                                            marks: number
                                        }[]>();

        if (error){
            throw(error.message);
        }

        return data;


    } catch(error: any) {
        console.error(error.message);
        return [];
    }
    
}


export const loadPaperQuestions = async (pupilId: string, classId: number, paperId: number) => {
 
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

export const loadPaperDetails = async (paperId: number) => {
    try {
        const supabase = createSupabaseServerClient(false);

        if (!supabase){
            throw ("Can not create Supabase client");
        }

        const {data, error} = await supabase.from("Papers")
                                        .select("id, year, month, paper")
                                        .eq("id", paperId)
                                        .returns<{
                                            id: number, 
                                            year: string, 
                                            month: string, 
                                            paper: string
                                        }>()
                                        .limit(1)
                                        ;

        if (error){
            console.error(error)
            throw(error.message);
        }

        //@ts-ignore
        return data[0];


    } catch(error: any) {
        console.error(error.message);
        return {}
    };
}
    


export const updateQuestionMarks = async (pupilId: string, 
    markId : number | null, 
    marks : number, 
    paperId: number,
    questionId : number) => {
    // todo add logic to upsert
    log(markId);

    const supabase = createSupabaseServerClient(true);

    if (!supabase){
        throw Error("Supabase not created")
    }

    if (markId) {
        // update
        log("Updating")
        const {data, error} = await supabase.from("PupilMarks").update(
            {   userId: pupilId, 
                questionId:questionId,
                marks: marks,
                paperId
            }
            )
            .eq("id", markId)
            .select("id");

        if (error) {
            console.error(error.message);
            throw Error(error.message);
        }

    } else {
        // insert
        log("Inserting")
        const {data, error} = await supabase.from("PupilMarks").insert(
            {   userId: pupilId, 
                questionId:questionId,
                marks: marks,
                paperId
            }
            ).select("id");

        if (error) {
                console.error(error.message);
                throw Error(error.message);
            }
    }

    revalidatePath('/')
    //revalidatePath('https://shiny-giggle-v6r5g9w9r43p6j7-3000.app.github.dev/spec-items/0d65c82d-e568-450c-a48a-1ca71151e80f/8/40/enter-marks')
}


