"use client"
import {useState, useEffect} from 'react';
import {getPaper, getQuestionsForPaper, getSpecItemsForSpec} from '/lib';
import 'react-data-grid/lib/styles.css';
import DataGrid, {textEditor} from 'react-data-grid';
import Button from "@mui/material/Button";


const EditPaperPage = ({params}) => {

    const [paper, setPaper] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [specItems, setSpecItems] = useState([]);
    
    const columns = [
        { key: 'id', name: 'id', width: 100 },
        { key: 'question_order', name: 'Order', width: 100, editor: textEditor },
        { key: 'question_number', name: 'Number', width: 100, editor: textEditor },
        { key: 'specItemId', name: 'Spec Item', width: 100, editor: ({ row, onRowChange}) => dropDownEditor({ row, onRowChange}) },
        { key: 'tag', name: 'name', width: 200},
        { key: 'specTitle', name: 'Title', width: 200},
        { key: 'marks', name: 'marks', width: 100, editor: textEditor}
      ];

      function rowKeyGetter(row) {
        return row.id;
      }
      
      

    const {paperId} = params;

    const loadPaper = async (paperId) => {
        const p  =await getPaper(paperId);
        setPaper(p);
    }

    const formatQuestions = (q) => {
      return q && q
          .filter(q => q.PaperId == paperId)
          .sort((a, b) => a.question_order < b.question_order ? 1: -1)
          .map(q => ({...q, tag : "1.1", specTitle: "This is a spec item" }))
    }

    const loadQuestions = async (paperId) => {
        const q = await getQuestionsForPaper(paperId);
        setQuestions(formatQuestions(q));
    }

    const loadSpecItems = async (specId) => {
        const si = await getSpecItemsForSpec(specId)

        setSpecItems(si);
    }

    useEffect(()=> {
        loadPaper(paperId);
        loadQuestions(paperId);
        
    }, [paperId]);

    useEffect (()=> {
      
      if (!paper) return;

      loadSpecItems(paper.specId);

    }, [paper])

    const handleQuestionsChange = (q) => {
        // console.log("Row Changed", q);
        setQuestions(q);
    }

    const sumMarks = (q) => {
      return q && q.reduce((curr, prev) => curr += parseInt(prev.marks), 0);
    }

    const nextOrder = (q) => {
      return q && q.length > 0 && q[0].question_order + 1
    }

    const handleOnClick = () => {
      const newQuestion = {
        question_order : nextOrder(questions),
        marks: 0,
        specItemId: 0,
        question_number: 0,
        PaperId: paperId

      }

      setQuestions(prev => formatQuestions([newQuestion, ...prev]))
    }

    return <>
        <h1>Editing paper {paperId}</h1>
        <Button onClick={handleOnClick}>Add</Button>
        {questions && <DataGrid 
                columns={columns} 
                rows={questions}
                onRowsChange={handleQuestionsChange}
                
                rowKeyGetter={rowKeyGetter} 
                onCellClick={(args, event) => {
                    if (args.column.key === 'title') {
                      event.preventGridDefault();
                      args.selectCell(true);
                    }
                  }}
                />}
        <pre>{JSON.stringify(specItems, null, 2)}</pre>
        <pre>{JSON.stringify(paper, null, 2)}</pre>
        <div>{sumMarks(questions)}</div>
        <div>{nextOrder(questions)}</div>
        <pre>{JSON.stringify(questions, null, 2)}</pre>
    </>

}


function dropDownEditor({ row, onRowChange}) {

  const specIds = [
    {id: 1, specId : 1, tag: "1.1", title: "Item 1 1"},
    {id: 2, specId : 1, tag: "1.2", title: "Item 1 2"},
    {id: 3, specId : 1, tag: "1.3", title: "Item 1 3"},
    {id: 4, specId : 1, tag: "2.1", title: "Item 2 1"},
    {id: 5, specId : 1, tag: "2.2", title: "Item 2 2"},
    {id: 6, specId : 1, tag: "2.3", title: "Item 2 3"},
    {id: 7, specId : 1, tag: "3.1", title: "Item 3 1"},

  ];

  return (
    <select
      
      value={row.specItemId}
      onChange={(event) => onRowChange({ ...row, specItemId: event.target.value }, true)}
      autoFocus
    >
      {specIds.map((si) => (
        <option key={si.id} value={si.id}>
          {si.tag}-{si.title}
        </option>
      ))}
    </select>
  );
}


export default EditPaperPage;