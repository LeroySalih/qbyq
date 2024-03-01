
import Card from "components/card";
import styles from "./display-spec-data-by-marks.module.css"
import {useEffect, useState} from "react";
import supabase from "app/utils/supabase/client";

const DisplaySpecDataByMarks = ({pupilId, specId}: {pupilId: string, specId: number}) => {

    const [specData, setSpecData] = useState(null);

    

    const loadData = async (userid: string) => {

        const {data, error} = await supabase.rpc("fn_pupil_marks_by_available_marks", {userid, specid: specId});

        error && console.error(error);

        // console.log(data);
        // @ts-ignore
        setSpecData(data)
    }

    useEffect(()=> {

        loadData(pupilId);

    }, [pupilId, specId])

    const footer = () => {

        if (!specData) return <div></div>
        
        //@ts-ignore
        const result = specData.reduce((c, p) => ({pMarks: p.pMarks + c.pMarks, aMarks: p.aMarks + c.aMarks }), {pMarks:0, aMarks: 0})
       
        return <>
                    <div className={styles.footer}>Total</div>
                    <div className={styles.footer}>{result.pMarks}</div>
                    <div className={styles.footer}>{result.aMarks}</div>
                    <div className={styles.footer}>{((result.pMarks / result.aMarks) * 100).toFixed(0)}%</div>
               </>
    }

    return <>
        <Card title="Question Type">
            <div className={styles.specItemGrid}>
                <div>Question Type</div>
                <div>Your Marks</div>
                <div>Available Marks</div>
                <div>%</div>

                {
                //@ts-ignore
                specData && specData.map((s, i) => [
                <div key={`1${i}`}>{s.avMarks}</div>,
                <div key={`2${i}`}>{s.pMarks}</div>,
                <div key={`3${i}`}>{s.aMarks}</div>,
                <div key={`4${i}`}>{((s.pMarks / s.aMarks) * 100).toFixed(0)}%</div>,
                
                ]
                )}

                {footer()}
            </div>
            
        </Card>
       
    </>
}

export default DisplaySpecDataByMarks;