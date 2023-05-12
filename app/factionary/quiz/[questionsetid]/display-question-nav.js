import {styles} from './display-question-nav.module.css';

/*
const DisplayQuestionNav = ({onScrollTo}) => {
 
    const {practice, answers, refs} = useContext(AppContext);
  
    const getNavButtonState = (id) => {
      return answers[id] ? 'answered' : ''
    }
    return  <>
    <div className={styles.navbarPanel}>
    {
      practice && practice.map((p, i) => <>
        <button 
            className={`${styles.question-nav-btn} ${getNavButtonState(practice[i].id)}`} 
            onClick={()=> onScrollTo(p.id)}>{i + 1}
        </button>
        {(i + 1 < practice.length) ? <div className={styles.navSpacer}><span>-</span></div> : <></>}
        </>)
    }
    </div>
    </>
  
  }
  */

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