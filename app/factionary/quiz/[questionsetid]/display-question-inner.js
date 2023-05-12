import {styles} from "./"
const DisplayQuestionInner = (props, ref) => {
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
        <div className={styles.card}>
          
          <div className={styles.layoutGrid}>
            <div className={`${styles.term} item`}>{question.term}</div>
            <div className={`${styles.def} item`}>{question.def}</div>
            <div className={`${styles.panel}`} ref={ref}>
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
        
      </>
    );
  };
  
  const DisplayQuestion = forwardRef(DisplayQuestionInner);