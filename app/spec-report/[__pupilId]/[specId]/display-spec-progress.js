const DisplaySpecProgress = ({pupilId, specId}) => {

    const [specData, setSpecData] = useState(null);

    const loadData = async () => {
        const {data, error} = await supabase.rpc('fn_pupil_marks_by_available_from_date', { specid: specId, uuid: pupilId});

        error && console.error(error);
        console.log("byDate", data);
        setSpecData(data.map(d => ({availableFrom: d.availablefrom, pMarks: d.pmarks, aMarks: d.amarks, pct: (d.pmarks / d.amarks)})));
    }
    useEffect(()=> {
        loadData();
    }, [pupilId, specId]);

    // fn_pupil_marks_by_paper 
    return <Card title="Progess">
        {specData && <Chart labels={specData.map(s => s.availableFrom)} data={specData.map(s => (s.pct * 100))}/>}
        
    </Card>
}


export default DisplaySpecProgress;