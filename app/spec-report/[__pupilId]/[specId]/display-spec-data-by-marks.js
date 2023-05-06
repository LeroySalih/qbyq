
import Card from "components/card";

const DisplaySpecDataByMarks = ({pupilId, specId}) => {

    const [specData, setSpecData] = useState(null);

    const loadData = async () => {

        const {data, error} = await supabase.rpc("fn_pupil_marks_by_available_marks", {userid: pupilId, specid: specId});

        error && console.error(error);

        console.log(data);

        setSpecData(data)
    }

    useEffect(()=> {

        loadData();

    }, [pupilId, specId])

    const footer = () => {

        if (!specData) return <div></div>
        
        const result = specData.reduce((c, p) => ({pMarks: p.pMarks + c.pMarks, aMarks: p.aMarks + c.aMarks }), {pMarks:0, aMarks: 0})
       
        return <>
                    <div className="footer">Total</div>
                    <div className="footer">{result.pMarks}</div>
                    <div className="footer">{result.aMarks}</div>
                    <div className="footer">{((result.pMarks / result.aMarks) * 100).toFixed(0)}%</div>
               </>
    }

    return <>
        <Card title="Question Type">
            <div className="specItemGrid">
                <div>Question Type</div>
                <div>Your Marks</div>
                <div>Available Marks</div>
                <div>%</div>

                {specData && specData.map((s, i) => <>
                <div key={`1${i}`}>{s.avMarks}</div>
                <div key={`2${i}`}>{s.pMarks}</div>
                <div key={`3${i}`}>{s.aMarks}</div>
                <div key={`4${i}`}>{((s.pMarks / s.aMarks) * 100).toFixed(0)}%</div>
                
                </>
                )}

                {footer()}
            </div>
            <style jsx="true">{`
        
                .specItemGrid {
                    display : grid;

                    grid-template-columns: repeat(4, 1fr);
                }

                .footer {
                    border-top : double 1px silver
                    text-weight: 
                }

                `}
            </style>
        </Card>
       
    </>
}

export default DisplaySpecDataByMarks;