"use client";

import { useState, useEffect, createContext, useContext, useRef, createRef, forwardRef } from "react";
import supabase from "components/supabase";
import {  UserContext } from 'components/context/user-context';
import {DateTime} from 'luxon';
import {styles} from './page.module.css'

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

  const [user, setUser] = useState(null);

  const loadUser = async () => {
    const {data: {user}} = await supabase.auth.getUser();
  }

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
      <div className={styles.App}>
        <div className={styles.pageHeader}>
          <h1>Unit 2 - Sources of Finance</h1>
          <DisplayQuestionNav onScrollTo={handleScrollTo} />
        </div>
        
        <div className={styles.pageDisplay}>
          
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
    </AppContext.Provider>
  );
}








