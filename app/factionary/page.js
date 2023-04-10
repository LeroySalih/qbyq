
"use client"
import {useState, useEffect, useContext} from 'react';
import Link from "next/link";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Loading from 'components/loading';
//https://www.npmjs.com/package/react-data-grid
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';

import supabase from 'components/supabase';
import {  UserContext } from 'components/context/user-context';

const shuffleArray = (array) => {
    return array
      .map((i) => ({ score: Math.random(), item: i }))
      .sort((a, b) => (a.score >= b.score ? 1 : -1))
      .map((i) => i.item);
  };

  const choseExcept = (questions, except) => {
    return shuffleArray(questions.filter((i) => i.id !== except.id))[0];
  };

  const createQuiz = (questions, count) => {
    return questions
      .map((q) => ({ score: Math.random(), item: q }))
      .sort((a, b) => (a.score > b.score ? 1 : -1))
      .slice(0, count)
      .map((i) => i.item)
      .map((i) =>
        Math.random() >= 0.5
          ? { ...i, result: true, questionId: i.id }
          : {
              ...i, questionId: i.id,
              def: choseExcept(Object.values(questions), i).def,
              result: false
            }
      );
  };

const LandingPage = () => {

    const ctx = useContext(UserContext);
    const {profile} = ctx;
    
    const loadQuestionSets = async ()=> {
        if (!profile) return;
        const {data, error} = await supabase
                    .from("TDFQuestionSets")
                    .select("id, owner, title, specId, Spec(title)")
                    .or(`owner.eq.${profile.id},owner.is.null` )


        error && console.error(error);
        console.log("QuestionSets", data)
        setQuestionSets(data.map((qs) => ({...qs, "specTitle": qs.Spec.title, create:'Create'})));
    }

    const handleNewQuiz = () => {}

    const [newQuizDlgOpen, setNewQuizDlgOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [questionSets, setQuestionSets] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleShowNewQuizDlg = () => {
        console.log("Clicked")
        setNewQuizDlgOpen(true);
    }

    const handleNewQuizDlgCancel = (v) => {
        console.log(v);
        setNewQuizDlgOpen(false);
    }

    const handleNewQuizDlgCreate = async (v) => {
        console.log("Creating...", email);
        // set loading spinner = true
        setLoading(true);
        
        // get the questions
        const {data: qsQuestions, error: questionsError} = await supabase
                                                            .from("TDFQuestions")
                                                            .select()
                                                            .eq("questionSetId", selectedRow.id);

        console.log("QSQuestions", qsQuestions);

        // create a quiz from the sample

        const quiz = createQuiz(qsQuestions, 10);

        console.log("Quiz", quiz);
        // write the questions to db, using type and JSON
        // redirect to the quiz

        
        setTimeout(()=> {
            // stop the loading spinner
            setLoading(false);

            // hide the dialog
            setNewQuizDlgOpen(false);
        }, 10000)
        
    }

    const handleCellClick = (cell) => {
        console.log("Cell Clicked", cell)

        if (cell.key = 'create'){
            setSelectedRow(cell.row);
            setNewQuizDlgOpen(true);
        }

    }

    const columns = [
        { key: 'id', name: 'ID' },
        { key: 'owner', name: 'Owner' },
        { key: 'title', name: 'Title' },
        { key: 'specId', name: 'Spec Id'},
        { key: 'specTitle', name: 'Spec'},
        { key: 'due', name: 'Due'},
        { key: '_7days', name: '7 Days'},
        { key: '_30days', name: '30 Days'}
      ];
      
      

    const rowKeyGetter = (row) => {
        return row.id;
    }

    useEffect(()=> {
        
    }, [])

    useEffect(()=> {
        loadQuestionSets();
    }, [profile])

    return <>
        <h1>This is the landing page</h1>
        <Link href="/factionary/quiz/1">Link to quiz</Link>
        <button onClick={handleShowNewQuizDlg}>Create New Quiz</button>

        <h1>Queue</h1>
        <DataGrid 
            columns={columns} 
            rows={questionSets} 
            rowKeyGetter={rowKeyGetter}
            onCellClick={handleCellClick}
            />;



        <Dialog open={newQuizDlgOpen} onClose={handleNewQuizDlgCancel}>
        <DialogTitle>Create quiz for {questionSets && selectedRow && questionSets.filter(qs => qs.id == selectedRow.id)[0].title}</DialogTitle>
        <DialogContent>

          <DialogContentText>
            We will create a quiz of 10 questions for {questionSets && selectedRow && questionSets.filter(qs => qs.id == selectedRow.id)[0].title}
            {loading && <Loading/>}
          </DialogContentText>
         
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewQuizDlgCancel}>Cancel</Button>
          <Button onClick={handleNewQuizDlgCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    
    </>
}


export default LandingPage;