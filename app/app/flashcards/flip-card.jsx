import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import styles from './flip-card.module.css';
import Button from '@mui/material/Button';

const variants = {
  front: { scale: 1, rotateX: 0, transition: { duration: 0.5 } },
  back: { scale: 1, rotateX: 180, transition: { duration: 0.5 } },
  exit: { scale: 0.9, opacity: 0 }
};

const TextVariants = {
  front: { rotateX: 0, transition: { duration: 0 } },
  back: { rotateX: 180, transition: { duration: 0 } },
  show: { opacity: 1, transition: { duration: 0.3 } },
  hide: { opacity: 0, transition: { duration: 0.3 } }
};

const FlipCard = ({ state, question,  onClick, onNext }) => {
  const textControls = useAnimation();
  const cardControls = useAnimation();
  const [displayText, setDisplayText] = useState("");
  const [choice, setChoice] = useState();

  const toggleAnimation = async () => {
    console.log("state", state, question);
    if (!question){
      return
    }

    // hide text
    await textControls.start("hide");

    // rotate card
    await cardControls.start(state === "front" ? "front" : "back");

    // rotate the text
    await textControls.start(state);

    // set the correct display text
    setDisplayText(state === "front" ? question.text : displayAnswer(question.term, question.text));

    // show the text
    return textControls.start("show");
  };

  useEffect(() => {
    if (question){
      console.log("Question", question)
      toggleAnimation();
    }
  }, [state, question]);

  useEffect(()=> {
    setChoice();
  }, [question]);

  const handleOnClick = (chosen) => {
    console.log(chosen);
    setChoice(chosen);
    onClick(chosen);
  } 

  const handleOnNext = () => {
    setChoice();
    onNext(choice);
  }

  const displayAnswer = (term, text) => {
    return text.replace('...', term);
  }

  return (
    <>
      <motion.div
        key={question?.id}
        variants={variants}
        animate={cardControls}
        className={styles.card}
      >
        <motion.div
          initial="hide"
          variants={TextVariants}
          animate={textControls}
        >
          <div className={styles.text}>{displayText}</div>
          {question && state==='front' && [question.term, ...question.distractors]
                .sort((a, b)=> a > b ? 1 : -1)
                .map((o, i) => <Button key={i} onClick={()=> {handleOnClick(o)}}>{o}</Button>)}
          {question && state==='back' &&  <Button onClick={handleOnNext}>Next Question</Button>}
        </motion.div>
      </motion.div>

     
    </>
  );
};

export const FlipCardContainer = ({ children }) => {
  return (
    <>
      <div className={styles.container}>{children}</div>
      
    </>
  );
};


export default FlipCard;
