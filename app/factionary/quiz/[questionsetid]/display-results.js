import {styles} from 'display-results.module.css';

const DisplayResults = ({ practice }) => {

    const { questions, answers, handleReset } = useContext(AppContext);
  
    const score = () => {
      return Object.values(answers)
        .filter((o) => o.choice != null)
        .reduce((prev, curr) => (curr.correct ? prev + 1 : prev - 1), 0);
    };

    return (
      <>
        <div className={styles.results}>
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
       
      </>
    );
  };