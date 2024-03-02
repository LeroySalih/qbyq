"use client"

import { useState, useEffect} from "react";
import { TextField, Button, Stack, Select, MenuItem } from "@mui/material";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import supabase from "app/utils/supabase/client";

import { insertQuestion, updateQuestion} from "./update-paper";
import {FormValues} from "./types";
import {useRouter} from "next/navigation";
import { Paper } from "types/alias";

type Specs = {
  id: any;
  title: any;
}[] | null;

type Papers =  {
  id: number;
  year: string | null;
  month: string | null;
  paper: string | null;
  specId: number | null;
}[] | null;

type SpecItems = {
  id: number;
  tag: string;
  title: string;
  SpecId: number;
}[] | null;


type PaperQuestion =  { id: number; question_number: string | null; specItemId: number | null; marks: number | null; question_order: number | null; } 
type PaperQuestions =  PaperQuestion[] 

export const CreateForm = ({papers, specs, specItems}:  {papers: Papers, specs: Specs, specItems: SpecItems}) => {

  const [currentSpecId, setCurrentSpecId] = useState<number>(0);
  const [currentPaperId, setCurrentPaperId] = useState<number>(0);
  const [paperQuestions, setPaperQuestions] = useState<PaperQuestions | null>(null);
  

  const loadPaperQuestions = async(paperId: number)=> {
    
    const {data, error} = await supabase.from("Questions").select("id, question_number, specItemId, marks, question_order").eq("PaperId", currentPaperId);

    error && console.error(error);

    setPaperQuestions(data);

  }

  useEffect(()=>{

    loadPaperQuestions(currentPaperId);

  }, [currentPaperId])

  const handleAddNew = async () => {

    const result = await insertQuestion({
      id: -1, 
      paperId: currentPaperId,
      questionNumber: "",
      marks: null,
      specItemId: null,
      questionOrder: null
    });

    const {data} = result;

    console.log("data", data);

    //@ts-ignore
    setPaperQuestions((prev) => [...prev, data]);

  }

  return <>
      <h1>Creating a Paper</h1>
        <Select value={currentSpecId} defaultValue={currentSpecId} onChange={(e) => setCurrentSpecId(e.target.value as number)}>
          <MenuItem key={0} value={0}>Select a Spec</MenuItem>
          {specs && specs.map((s, i) => <MenuItem key={s.id} value={s.id}>{s.title}</MenuItem>)}
        </Select>

        <Select value={currentPaperId} defaultValue={currentPaperId} onChange={(e) => setCurrentPaperId(e.target.value as number)}>
          <MenuItem key={0} value={0}>Select a Paper</MenuItem>
          {papers && papers.filter((p) => p.specId == currentSpecId).map((p, i) => <MenuItem key={p.id} value={p.id}>{p.year}-{p.month}-{p.paper}</MenuItem>)}
        </Select>

        <Button variant="contained" color="primary" onClick={handleAddNew}>Add New</Button>

        <div>
        {paperQuestions && paperQuestions.map((q, i) => <DisplayPaperQuestion key={i} question={q} specItems={specItems} currentPaperId={currentPaperId} currentSpecId={currentSpecId}/>)}
        </div>

        
      </>
}


const DisplayPaperQuestion = ({question, specItems, currentPaperId, currentSpecId}: {
  question: PaperQuestion, 
  specItems: SpecItems, 
  currentPaperId: number, 
  currentSpecId: number
}) => {
  
  const [paperQuestion, setPaperQuestion] = useState<PaperQuestion>(question)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const handleUpdateQuestion = (field: string, value: string | number | null) => {
    const update = Object.assign({}, {... paperQuestion}, {[field]:value} )
    console.log("Updating Stated", update)
    setIsDirty(true);
    setPaperQuestion((prev) => update);
  }

  const saveQuestionToDb = async (question: PaperQuestion) => {
    if (!isDirty) return;
    setIsSaving(true);
    const result = await updateQuestion({
      ...question, 
      paperId: currentPaperId, 
      questionNumber: question.question_number || "",
      questionOrder: question.question_order
    });

    console.log(result);
    setIsDirty(false)
    setIsSaving(false)
  }

  useEffect(()=> {
    
    saveQuestionToDb(paperQuestion)
  }, [paperQuestion])


  return <div>
    <TextField value={paperQuestion.id} sx={{width: 100}} disabled ></TextField>
    <TextField label="Number" value={paperQuestion.question_number} sx={{width: 100}} onChange={(e)=> handleUpdateQuestion('question_number', e.target.value)}></TextField>
    <TextField label="Marks" value={paperQuestion.marks} sx={{width: 100}}  onChange={(e)=> handleUpdateQuestion('marks', e.target.value)}></TextField>
    <TextField label="Order" value={paperQuestion.question_order} sx={{width: 100}}  onChange={(e)=> handleUpdateQuestion('question_order', e.target.value)}></TextField>
    <Select label="Spec Item" defaultValue={paperQuestion.specItemId} value={paperQuestion.specItemId}  onChange={(e)=> handleUpdateQuestion('specItemId', e.target.value)}>
      <MenuItem key={0} value={0}>Select Spec Item</MenuItem>
      {
        specItems && specItems
                .filter(s => s.SpecId == currentSpecId)
                .sort((a,b) => a.tag > b.tag ? 1 : -1)
                .map((s, i) => <MenuItem key={s.id} value={s.id}>
          {s.tag}-{s.title}
          </MenuItem>)
      }
    </Select>
    {
      isSaving && <span>Saving</span>
    }

  </div>

}