"use server"
import {createSupabaseServerClient} from "app/utils/supabase/server";
import {FormValues, Question} from "./types";
import {Paper} from "./types"
import { revalidatePath } from "next/cache";

export const insertQuestion = async ( question: Question ) => {

    const supabase = createSupabaseServerClient();

    if (!supabase) {
        return;
    }

    const {data, error} = await supabase.from("Questions").insert({
        PaperId: question.paperId,
        question_number: question.questionNumber,
        marks: question.marks,
        specItemId: question.specItemId,
        question_order: question.questionOrder
    }).select()

    error && console.error(error)

    return {result: "ok", data: data && data[0]};
}

export const updateQuestion = async (question : Question) => {

    // console.log("Updating ", question);
    
    const supabase = createSupabaseServerClient();

    if (!supabase) {
        return;
    }

    const {data, error} = await supabase.from("Questions").update({
        PaperId: question.paperId,
        question_number: question.questionNumber,
        marks: question.marks,
        specItemId: question.specItemId,
        question_order: question.questionOrder
    }).eq("id", question.id).select()

    error && console.error(error)
    // console.log("Updated")
    // console.log(data)

    return {result:"ok", data: data && data[0]}

}

const updatePaper = (data: FormValues) => {
    

    data.questions.forEach((q: Question) => q.id == -1 ? insertQuestion(q) : updateQuestion(q))

    return {msg: "ok"}
    
}


export const createNewPaper = async (data:Paper) => {

    const supabase = createSupabaseServerClient();

    if (!supabase) {
        return {id: null, error: "Supabase not created"};
    }

    const {year, month, paper, title, marks, specId, subject, qPaperLabel, aPaperLabel } = data;
    
    // console.log({year, month, paper, title, marks, specId, subject });

    const {data: newPaper, error} = (await supabase.from("Papers").insert({year, month, paper, title, marks, specId, subject, qPaperLabel, aPaperLabel }).select("id"));

    error && console.error(error);
    
    // console.log(newPaper)
    // @ts-ignore
    const id = newPaper[0].id;

    return {id, error};
}

export async function deleteQuestion  (id: number)  {

    const supabase = createSupabaseServerClient();

    if (!supabase) {
        return {id: null, error: "Supabase not created"};
    }

    // console.log("Deleting record:", id);

    const {data, error} = await supabase.from("Questions").delete().eq("id", id);

    // console.log("data", data);

    error && console.error(error);

    revalidatePath("/");
    
    return {data, error};

}

    


export default updatePaper;