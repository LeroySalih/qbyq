import Card from "components/card";

const DisplaySpecDataByItem = ({pupilId, specId}) => {


    const [specData, setSpecData] = useState(null);

    const loadData = async () => {

        const {data, error} = await supabase.rpc("fn_pupil_marks_by_spec_item", {userid: pupilId, specid: specId});

        error && console.error(error);

        console.log("SpecData", data);

        setSpecData(data)
    }

    useEffect(()=> {

        loadData();

    }, [pupilId, specId])

    const footer = () => {

        if (!specData) return <div></div>
        
        const result = specData.reduce((c, p) => ({pMarks: p.pMarks + c.pMarks, aMarks: p.aMarks + c.aMarks }), {pMarks:0, aMarks: 0})
       
        return <>
                <div></div>
                <div>Total</div>
                <div>{result.pMarks}</div>
                <div>{result.aMarks}</div>
                <div>{((result.pMarks / result.aMarks) * 100).toFixed(0)}%</div>
            </>
    }

    return <>
        <Card title="Spec Items">
            <div className="specItemGrid">
                    <div>Tag</div>
                    <div>Item</div>
                    <div>Your Marks</div>
                    <div>Available Marks</div>
                    <div>%</div>

                {specData && specData.map((s,i) => <>
                    <div>{s.specTag}</div>
                    
                    <div>{(s.revisionMaterials !== null) ? <Link href={`${s.revisionMaterials}`}>{s.specItem}</Link> : <span>{s.specItem}</span>}</div>
                    <div>{s.pMarks}</div>
                    <div>{s.aMarks}</div>
                    <div>{((s.pMarks / s.aMarks) * 100).toFixed(0)}%</div>
                </>)}
                { footer() }
            </div>
            <style jsx="true">{`
        
            .specItemGrid {
                display : grid;

                grid-template-columns: 1fr 4fr 1fr 1fr 1fr;
            }
            `}
        </style>
        </Card>
    </>
}

export default DisplaySpecDataByItem;
