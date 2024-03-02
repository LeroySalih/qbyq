"use client"
import NewPaper from "./new-paper";
import {useState} from "react";
import supabase from "app/utils/supabase/client";

const Page = () => {

    const [paper, setPaper] = useState();

    


    const writeQuestion = async (id: number, q: any) => {

        console.log("Writting question", q);
        const {data: questionData, error: questionError} = await supabase.from("Questions").insert({
            marks : q.marks, 
            specItemId : q.specItemId, 
            question_order : q.question_order, 
            question_number : q.question_number, 
            PaperId: id
        }).select("id");
            
        questionError && console.error(questionError);
        console.log(questionData);

    }

    const handlePaperChange = async (newPaper: any) => {

        const {SpecId, year, month, paper, marks} = newPaper;
        
        const {data, error  } = await supabase
                                                .from("Papers")
                                                .insert({specId: SpecId, year, month, paper, marks})
                                                .select("id")
                                                .maybeSingle()
                                                ;

        error && console.error(error);

        const id = data!.id;

        console.log("Created Paper ", id);


        for (const q of newPaper.questions) {
            await writeQuestion(id, q);
        }
        
        setPaper (newPaper);
    }

    return <>
        <h1>Add Paper</h1>
        <NewPaper paper={paper} onPaperChange={handlePaperChange} />
        <pre>{JSON.stringify(paper, null, 2)}</pre>
    </>
}


export default Page;