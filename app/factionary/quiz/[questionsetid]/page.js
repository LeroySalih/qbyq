"use client"


import { useState, useEffect, createContext, useContext, useRef, createRef, forwardRef } from "react";
import supabase from "components/supabase";
import {  UserContext } from 'components/context/user-context';
import {DateTime} from 'luxon';

// import QuestionsRaw from "./questions.js";

const AppContext = createContext(null);

export default function App({params}) {
  
  const loadQuestions = async (pid, questionsetid) => {
    
    const { data, error } = await supabase
                  .rpc('fn_tdf_get_queue', {
                    pid, 
                    questionsetid
                  })

    error && console.error(error);  
    data && console.log("QueueQuestions", data);

    setAllQuestions(data);
  }

  const parseQuestions = (QuestionsRaw) => {
    const lines = QuestionsRaw.split("\n");
    return lines.map((l, i) => ({
      id: i,
      term: l.split("::")[0],
      def: l.split("::")[1]
    }));
  };

  const createRefs = (practice) => {
    const tmpRefs = practice?.reduce((prev, curr) => {
        prev[curr.id] = createRef();
        return prev;
        }, {});

    console.log("tmpRefs", tmpRefs,practice);

    setRefs(tmpRefs);
  }

  const shuffleArray = (array) => {
    return array
      .map((i) => ({ score: Math.random(), item: i }))
      .sort((a, b) => (a.score >= b.score ? 1 : -1))
      .map((i) => i.item);
  };

  const choseExcept = (questions, except, getter) => {
    return shuffleArray(questions.filter((i) => getter(i) !== getter(except)))[0];
  };

  const createQueueFromQuestions = (questions, queueType) => {

    // different filter criteria depening on queueType
    const queueFilters = {
      0 : (x) => DateTime.fromISO(x.dueDate).startOf('day') <= DateTime.now().endOf('day'),
      7 : (x) => DateTime.fromISO(x.dueDate).startOf('day') > DateTime.now().endOf('day') && DateTime.fromISO(x.dueDate).startOf('day') <= DateTime.now().plus({days: 7}).endOf('day'),
      30 : (x) => DateTime.fromISO(x.dueDate).startOf('day') > DateTime.now().plus({days:7}).endOf('day')
    }

    // filter and return the queue
    return questions.filter(queueFilters[queueType]);
  };

  const buildQueues = (allQuestions, queueTypes) => {

    return queueTypes.reduce((prev, curr) =>  {
      prev[curr] = shuffleArray(createQueueFromQuestions(allQuestions, curr));
      return prev;
      }, {}

      );

  }

  const createQuestion = (currentQuestion, allQuestions) => {
    
    const question =  Math.random() >= 0.5 ? 
            { ...currentQuestion, 
              correctAnswer: currentQuestion.questionId 
            } : {
              ...currentQuestion,
              ...(()=> { 
                const tmp = choseExcept(
                    allQuestions, 
                    currentQuestion, 
                    x => x.questionId
                  );
                return {def: tmp.def, correctAnswer: tmp.questionId}
              })()    // add random id and def as correctAnswer
              
            };

    console.log("CReating Question", question);
    return question;
  };

  const reset = () => {
    setAnswers({});
    setIsSubmitted(false);
  };

  // the current question set (from page param)
  const {questionsetid} = params;
  
  // all questions inthe question set.
  const [allQuestions, setAllQuestions] = useState([]);

  const [queues, setQueues] = useState({});

  // questions generated fo rthe current queue
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // User selected current queue
  const [currentQueue, setCurrentQueue] = useState(0);

  //const [answers, setAnswers] = useState({});
  //const [isSubmitted, setIsSubmitted] = useState(false);
  //const [refs, setRefs] = useState({});
  //const resultsPanelRef = useRef(null);
  
  // Profile for current user
  const {profile} = useContext(UserContext);
  
  const FIRST_QUESTION = 0;

  useEffect(() => {
    
    console.log("Checking profile, questionsetid", profile, questionsetid)
    
    if (!profile || !questionsetid) return;
    
    loadQuestions (profile.id, questionsetid);

  }, [profile, questionsetid]);

  useEffect(()=> {
  
    if (!allQuestions || allQuestions.length == 0) return;

    console.log("Building Queues")
    setQueues(buildQueues(allQuestions, [0, 7, 30]));

    
  }, [allQuestions])

  useEffect(()=> {
    
    console.log("useEffect -> Queues", queues, currentQueue, queues[currentQueue])
    if (!queues[currentQueue]) return;

    if (queues[currentQueue].length == 0){
      setCurrentQuestion(null);
      return;
    }

    const question = createQuestion(queues[currentQueue][0], allQuestions)
    console.log("Current Question", question);
    setCurrentQuestion(question);

  }, [queues, currentQueue])
 

  const handleSubmit = () => {
    setIsSubmitted(true);
    resultsPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  
  const handleScrollTo = (id) => {
    console.log(refs);
    refs[id]?.current.scrollIntoView({behavior: "smooth", block: 'center'});
  }

  const handleReset = () => {
    //const qs = parseQuestions(QuestionsRaw);

    //setPractice(createPractice(qs, 3));
    loadQuestions();
  };

  const handleOnNext = (state) => {

    const tmpCurrent = Object.assign({}, currentQuestion);
    tmpCurrent.result = state;

    if (state) {
      // answer was correct
      
      if (tmpCurrent.inQueue == 30 || tmpCurrent.inQueue == 7) 
      {
        tmpCurrent.inQueue = 30;
        tmpCurrent.dueDate = DateTime.fromISO(tmpCurrent.dueDate).plus({days: 30}).toISO()
      }
      if (tmpCurrent.inQueue == 0 ) 
      {
        tmpCurrent.inQueue = 7;
        tmpCurrent.dueDate = DateTime.fromISO(tmpCurrent.dueDate).plus({days: 7}).toISO()
      }
    }
    else {
      // answer was incorrect, so reset the queue and leave as current date
      tmpCurrent.inQueue = 0;
    
    }

    // find the current question in all questions
    // update the values of current question in all question
    

    // update result and dueDate on all Questions
    const tmpAllQuestions = allQuestions.map((q) => {
      if (q.questionId != tmpCurrent.questionId){
        return q
      }
      return {
        ...q,
        dueDate : tmpCurrent.dueDate,
        result : tmpCurrent.result,
        inQueue : tmpCurrent.inQueue
      }
      });


      console.log("tmpAllQuestions", tmpAllQuestions, tmpCurrent);

      setAllQuestions(tmpAllQuestions);
      
  }

  

  return (
    <AppContext.Provider
      value={{ allQuestions,  currentQuestion }}
    >
      <div className="App">
        <div className="page-header">
          <h1>Unit 2 - Sources of Finance</h1>
          <DisplayQuestionNav onScrollTo={handleScrollTo} />
        </div>
        
        <div className="page-display">
          
          <div>
            <select value={currentQueue} onChange={(e) => setCurrentQueue(e.target.value)}>
              <option value={0}>Due Today</option>
              <option value={7}>Within 7 Days</option>
              <option value={30}>Within 30 Days</option>
            </select>
            <span>Found  of {allQuestions.length }questions in queue</span>
          </div>
          {queues && 
            <>
              <div>0: {queues[0]?.length}</div>
              <div>7: {queues[7]?.length}</div>
              <div>30: {queues[30]?.length}</div>
            </>
          }
          
          <pre>{JSON.stringify(currentQuestion, null, 2)}</pre>  

          {
            currentQuestion && 
            <DisplayQuestion question={currentQuestion} onNext={handleOnNext}/>
          }

        

          
          
        </div>
      </div>
      <style jsx="true">
        {`
          .page-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #c0c0c0;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 100;
            padding-left: 3rem;
            padding-right: 3rem;
          }

          .page-header button {
            height: 2rem;
            border: 1px solid blue;
            background-color: white;
            border-radius: 0.5rem;
          }

          .page-display {
            max-height: calc(100vh - 85px);
            overflow: scroll;
            margin-top: 85px;
          }

          .submit-panel {
            display: flex;
            justify-content : center;
          }

          .submit-button {
            width: 100%;
            background-color: #5a5adc;
            border-radius: 1rem;
            color: yellow;
            font-size: 1.2rem;
            padding: 1rem;
            margin: 2rem;
            margin-right: 2rem;
            max-width: 250px;
            border : none;
          }


          .results-panel {
            display: flex;
            justify-content: center;
            padding: 1rem;
          }

        `}
      </style>
    </AppContext.Provider>
  );
}


const DisplayQuestionNav = ({onScrollTo}) => {

  const {practice, answers, refs} = useContext(AppContext);

  const getNavButtonState = (id) => {
    return answers[id] ? 'answered' : ''
  }
  return  <>
  <div className="navbar-panel">
  {
    practice && practice.map((p, i) => <>
      <button className={`question-nav-btn ${getNavButtonState(practice[i].id)}`} onClick={()=> onScrollTo(p.id)}>{i + 1}</button>
      {(i + 1 < practice.length) ? <div className="nav-spacer"><span>-</span></div> : <></>}
      </>)
  }
  </div>
  <style jsx="true">{`

    .navbar-panel {
      display: flex;
      align-items: center;
    }


    .nav-spacer {
      display: flex;
      font-size: 2rem;
      color: blue;
    }

    .question-nav-btn {
      border-radius: 2rem;
      font-size:0.6rem;
      border : blue solid 1px;
      height : 1rem;
      width : 1rem;
      display: flex;
      justify-content : center;
      cursor: pointer;
    }

    .answered {
      color: white;
      background-color: blue;
    }
  
  `}</style>
  </>

}


const displayQuestion = (props, ref) => {
  const { question, onNext } = props;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswer, setUserAnswer] = useState(undefined);
  const {allQuestions, practice} = useContext(AppContext);

  const { answers, setAnswers } = useContext(AppContext);

  useEffect(()=> {
    setUserAnswer(undefined);
  }, [question]) 

  const handleClick = (choice) => {
    
    setUserAnswer(choice);

    console.log("Writing to DB");

    //const tmpAnswers = Object.assign({}, answers);
    //tmpAnswers[question.id] = { choice, correct: choice === question.result };
    //setAnswers(tmpAnswers);
  };

  const handleOnNext = () => {
    onNext(userAnswer == (question.questionId == question.correctAnswer));
  }

  const  getButtonSelectedState = (type) => {
    if (userAnswer === undefined) return '';

    return type == userAnswer ? 'selected' : '';
  }

  const getButtonState = (type) => {
    
    // user hasn't asnswered
    if (userAnswer === undefined )
      return ''


    if (type === (question.questionId == question.correctAnswer))
      return 'correct';

    return 'incorrect';
      
  };

  return (
    <>
      <div className="card">
        
        <div className="layout-grid">
          <div className="term item">{question.term}</div>
          <div className="def item">{question.def}</div>
          <div className="panel" ref={ref}>
            <button
              disabled={userAnswer !== undefined}
              className={`${getButtonSelectedState(true)} ${getButtonState(true)}`}
              onClick={() => handleClick(true)}
            >
              True
            </button>
            <button
              disabled={userAnswer !== undefined}
              className={`${getButtonSelectedState(null)} ${getButtonState(null)}`}
              onClick={() => handleClick(null)}
            >
              Dont Know
            </button>
            <button
              disabled={userAnswer !== undefined}
              className={`${getButtonSelectedState(false)} ${getButtonState(false)}`}
              onClick={() => handleClick(false)}
            >
              False
            </button>
          </div>
            <div>
                  {
                    userAnswer !== undefined && 
                    <>
                      <div>Question Due Date: {question.dueDate}</div>
                      <div>
                          <span>The correct answer is&nbsp;</span>
                          <b>{question.questionId === question.correctAnswer ? "True" : "False"}</b>
                      </div>
                      <div>
                        {
                          allQuestions.filter(
                            q => q.questionId === question.questionId)[0]
                            .def.replace('(...)', question.term)
                        }
                      </div>
                      
                      <div>
                        <button onClick={handleOnNext}>Next</button>
                      </div>
                    </>
                  }
                

                  

                  
            </div>
        </div>
      </div>
      <style jsx="true">
        {`
          .card {
            border: silver 1px solid;
            margin: 2rem;
            padding: 2rem;
            border-radius: 2rem;
            background-color: white;
          }

          .layout-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-areas: "term def" "panel panel";
          }

          .item {
            font-size: 1.5rem;
            text-align: center;
            min-height: 5rem;
            padding: 1rem;
          }

          .term {
            grid-area: term;
            border-right: solid 1px silver;
          }
          .def {
            grid-area: def;
          }
          .panel {
            grid-area: panel;
            display: flex;
          }

          .panel button {
            width: 100%;
            background-color: white;
            border: silver 1px solid;
            border-radius: 0.25rem;
            padding: 1rem;
            margin: 1rem;
          }

          .selected {
            border: blue 5px solid !important;
          }

          .correct {
            background-color: #abebab !important;
          }

          .incorrect {
            background-color: #ebc6c7 !important;
          }
        `}
      </style>
    </>
  );
};

const DisplayQuestion = forwardRef(displayQuestion);


const DisplayResults = ({ practice }) => {
  const { questions, answers, handleReset } = useContext(AppContext);

  const score = () => {
    return Object.values(answers)
      .filter((o) => o.choice != null)
      .reduce((prev, curr) => (curr.correct ? prev + 1 : prev - 1), 0);
  };
  return (
    <>
      <div className="results">
        <div>
          <div>Found {practice && practice.length} questions</div>
          <div>Found {Object.values(answers)?.length ?? 0} answers</div>
        </div>
        <div>
          <div>
            Found{" "}
            {Object.values(answers).reduce(
              (prev, curr) => (curr.correct ? prev + 1 : prev),
              0
            )}{" "}
            Correct
          </div>
          <div>
            Found{" "}
            {Object.values(answers).reduce(
              (prev, curr) => (curr.choice == null ? prev + 1 : prev),
              0
            )}{" "}
            Dont Know
          </div>
          <div>
            Found{" "}
            {Object.values(answers).reduce(
              (prev, curr) =>
                !curr.correct && curr.choice != null ? prev + 1 : prev,
              0
            )}{" "}
            Incorrect
          </div>
        </div>
        <div>
          <div>
            <div>Score</div>
            <div>{score()}</div>
            <button onClick={handleReset}>Reset</button>
          </div>
        </div>
      </div>
      <style jsx="true">
        {`
          .results {
            width: 80%;
            background-color: #e0f0f0;
            border: silver 1px solid;
            padding: 1rem;
            border-radius: 1rem;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            box-shadow: 0px 0px 10px #808080;
          }
        `}
      </style>
    </>
  );
};
