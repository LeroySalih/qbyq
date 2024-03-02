"use server"
import {createSupabaseServerClient} from "app/utils/supabase/server";
import {FormValues, Question} from "./types";


export const insertQuestion = async ( question: Question ) => {

    const supabase = createSupabaseServerClient();

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

    console.log("Updating ", question);
    
    const supabase = createSupabaseServerClient();

    const {data, error} = await supabase.from("Questions").update({
        PaperId: question.paperId,
        question_number: question.questionNumber,
        marks: question.marks,
        specItemId: question.specItemId,
        question_order: question.questionOrder
    }).eq("id", question.id).select()

    error && console.error(error)
    console.log("Updated")
    console.log(data)

    return {result:"ok", data: data && data[0]}

}

const updatePaper = (data: FormValues) => {
    

    data.questions.forEach((q: Question) => q.id == -1 ? insertQuestion(q) : updateQuestion(q))

    return {msg: "ok"}
    
}

    


export default updatePaper;