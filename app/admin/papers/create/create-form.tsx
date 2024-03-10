"use client"

import { useState, useEffect} from "react";
import { TextField, Button, Stack, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import supabase from "app/utils/supabase/client";

import { insertQuestion, updateQuestion, createNewPaper, deleteQuestion} from "./update-paper";
import {FormValues} from "./types";
import {useRouter} from "next/navigation";
import { Paper } from "types/alias";
import { revalidatePath } from "next/cache";

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { CollectionsBookmarkRounded } from "@mui/icons-material";

import styles from "./create-form.module.css"

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


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

  const [showDlg, setShowDlg] = useState<boolean>(false);
  const [currentSpecId, setCurrentSpecId] = useState<number>(0);
  const [currentPaperId, setCurrentPaperId] = useState<number>(0);
  const [paperQuestions, setPaperQuestions] = useState<PaperQuestions | null>(null);
  const [paperChoices, setPaperChoices] = useState<Papers | null>(papers);

  
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

    if (!result){
      return;
    }

    const {data} = result;

    console.log("data", data);

    //@ts-ignore
    setPaperQuestions((prev) => [...prev, data]);

  }

  const handleNewPaper = async () => {
    console.log("New Paper")
    setShowDlg(true);
  }

  const handleSubmitDlg = async (data: any) => {
    console.log("Data from dialog in handleSubmitDlg", data);

    console.log("Processing Form")
      
    
    // create paper, returning paper id
    const {year, month, paper, title, marks, specId, subject, questionPaper, answerPaper } = data;
    console.log({year, month, paper, title, marks, specId, subject })
    const result = await createNewPaper({year, month, paper, title, marks, specId, subject, qPaperLabel: questionPaper.name, aPaperLabel: answerPaper.name });

    if (!result || result.error || !result.id) {
      console.error(result?.error);
      return;
    }

    console.log("Data returned", result);
    const {id} = result;

    console.log("Found Papers", questionPaper, answerPaper);
    // setCurrentSpecId(data.specId);
    const {data: qPaperData, error: qPaperError} = await supabase.storage.from("exam-papers").upload(`${id}/${questionPaper.name}`, questionPaper);
    qPaperError && console.error(qPaperError);
    console.log("Q Paper Data", qPaperData);

  
    const {data: aPaperData, error: aPaperError} = await supabase.storage.from("exam-papers").upload(`${id}/${answerPaper.name}`, answerPaper);
    aPaperError && console.error(aPaperError);
    console.log("Q Paper Data", aPaperData);

    
    setCurrentSpecId(data.specId)
    // @ts-ignore
    setPaperChoices((prev) => [...prev, {id, year, month, specId}])
    setCurrentPaperId(id);

    setShowDlg(false);
  }

  const handleCancelDlg = async () => {
    
    setShowDlg(false);
  }

  const reload = async () => {
    console.log("Refreshing data");
    loadPaperQuestions(currentPaperId)
  }

  return <>
      <h1>Creating a Paper {currentPaperId}</h1>
        
        <button onClick={()=>{loadPaperQuestions(currentPaperId)}}>Refresh</button>
        <div><Button variant="outlined" onClick={handleNewPaper}>New Paper</Button></div>
        
        <NewPaperDialog show={showDlg} onCancel={handleCancelDlg} onSave={handleSubmitDlg}/>
        
        <Select value={currentSpecId} defaultValue={currentSpecId} onChange={(e) => setCurrentSpecId(e.target.value as number)}>
          <MenuItem key={0} value={0}>Select a Spec</MenuItem>
          {specs && specs.map((s, i) => <MenuItem key={s.id} value={s.id}>{s.title}</MenuItem>)}
        </Select>

        <Select value={currentPaperId} defaultValue={currentPaperId} onChange={(e) => setCurrentPaperId(e.target.value as number)}>
          <MenuItem key={0} value={0}>Select a Paper</MenuItem>
          {paperChoices && paperChoices.filter((p) => p.specId == currentSpecId).map((p, i) => <MenuItem key={p.id} value={p.id}>{p.year}-{p.month}-{p.paper}</MenuItem>)}
        </Select>

        <Button variant="contained" color="primary" onClick={handleAddNew}>Add New</Button>
        
        <div className={styles.head}>&nbsp;</div>

        <div>
        {paperQuestions && paperQuestions.sort((a, b) => (a.question_order || 0) > (b.question_order || 0) ? 1 : -1).map((q, i) => <DisplayPaperQuestion key={i} question={q} specItems={specItems} currentPaperId={currentPaperId} currentSpecId={currentSpecId} reload={reload}/>)}
        </div>

        <div className={styles.footer}> &nbsp;</div>
        
      </>
}


const DisplayPaperQuestion = ({question, specItems, currentPaperId, currentSpecId, reload}: {
  question: PaperQuestion, 
  specItems: SpecItems, 
  currentPaperId: number, 
  currentSpecId: number,
  reload: () => void,
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

  const handleDeleteQuestion = async (id: number) => {
    setIsSaving(true);
    await deleteQuestion(id);
    reload();
    setIsSaving(false);
  }

  useEffect(()=> {
    
    saveQuestionToDb(paperQuestion)
  }, [paperQuestion])


  return <div>
    <Button onClick={() => handleDeleteQuestion(paperQuestion.id)}>X</Button>
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


const NewPaperDialog = (
  {show, onSave, onCancel}: 
  {show: boolean, 
    onSave : (data: any | null)=> void, 
    onCancel: () => void}) => {

  console.log("Show:", show);

  const handleClose = async () => {
    console.log("Handle Close Called")
    onCancel();
  }

  const handleSubscribe = async (data: any) => {
    console.log("Handle Subscribe Called 2")
   // const formData = new FormData(event.currentTarget)
   // const formJSON = Object.fromEntries((formData as any).entries());
   // console.log("Form Data", formJSON);
    onSave(data);
  }

  return (<Dialog
  open={show}
  onClose={handleClose}
  PaperProps={{
    component: 'form',
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log("Processing Form")
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries((formData as any).entries());
      
      console.log("Form Data", formJson);
      handleSubscribe(formJson);
    },
  }}
>
  <DialogTitle>Subscribe</DialogTitle>
  <DialogContent>
    <DialogContentText>
      To subscribe to this website, please enter your email address here. We
      will send updates occasionally.
    </DialogContentText>
    <TextField
      autoFocus
      required
      margin="dense"
      id="year"
      name="year"
      label="Year"
      type="text"
      fullWidth
      variant="standard"
    />
    <TextField
      autoFocus
      required
      margin="dense"
      id="month"
      name="month"
      label="Month"
      type="text"
      fullWidth
      variant="standard"
    />
    <TextField
      required
      margin="dense"
      id="title"
      name="title"
      label="Title"
      type="text"
      fullWidth
      variant="standard"
    />
    <TextField
      required
      margin="dense"
      id="subject"
      name="subject"
      label="Subject"
      type="text"
      fullWidth
      variant="standard"
    />
    <TextField
      required
      margin="dense"
      id="paper"
      name="paper"
      label="Paper"
      type="text"
      fullWidth
      variant="standard"
    />
    <TextField
      required
      margin="dense"
      id="specId"
      name="specId"
      label="SpecId"
      type="text"
      fullWidth
      variant="standard"
    />
    <TextField
      required
      margin="dense"
      id="marks"
      name="marks"
      label="Marks"
      type="number"
      fullWidth
      variant="standard"
    />
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Question Paper
      <VisuallyHiddenInput type="file" name="questionPaper" id="questionPaper"/>
    </Button>
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Answer Paper
      <VisuallyHiddenInput type="file" name="answerPaper" id="answerPaper"/>
    </Button>
    
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button type="submit">Create</Button>
  </DialogActions>
</Dialog>
)
}