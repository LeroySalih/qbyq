import supabase from "app/utils/supabase/client";
import {useState, useEffect } from 'react';
import Card from 'components/card';
import {Chart} from 'components/line-chart';

const DisplaySpecProgress = ({pupilId, specId}: {pupilId: string, specId: number}) => {

    const [specData, setSpecData] = useState(null);


    const loadData = async () => {
        const {data, error} = await supabase.rpc('fn_pupil_marks_by_available_from_date', { specid: specId, uuid: pupilId});

        error && console.error(error);
        // console.log("byDate", data);
        // @ts-ignore
        setSpecData(data?.map(d => ({availableFrom: d.availablefrom, pMarks: d.pmarks, aMarks: d.amarks, pct: (d.pmarks / d.amarks)})));
    }

    useEffect(()=> {
        loadData();
    }, [pupilId, specId]);

    // fn_pupil_marks_by_paper 
    return <Card>
        {
        // @ts-ignore
        specData && specData.length > 0 && <Chart labels={specData.map(s => s.availableFrom)} data={specData.map(s => (s.pct * 100))}/>
        }
        
    </Card>
}


export default DisplaySpecProgress;