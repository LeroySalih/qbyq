

import { GetPaperMarksForPupil, GetPaperMarksForPupilItem } from 'types/alias';

//import DisplayClasses from 'components/display-classes';
import styles from "./page.module.css"
import Link from "next/link";

import Card from "components/card"
import { createSupabaseServerClient } from "app/utils/supabase/server";

type PupilDetails = {
      pupilId : string,
      firstName: string,
      familyName: string,
      classes : {
        [key: string] : GetPaperMarksForPupilItem
      }
    }

const MainPage = async ({params} : {params : {userid: string}}) => {
    
  const {userid} = params

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return <h1>Error Creating Supabase</h1>;
  } 

  const shapePaperData = (paperData: GetPaperMarksForPupil) => {

    if (!paperData || paperData.length == 0)
      return null;

    const pupilDetails: PupilDetails = {
      pupilId: paperData[0].pupilId, 
      firstName: paperData[0].firstName, 
      familyName: paperData[0].familyName, 
      classes: {}
    };

  
    pupilDetails.classes = paperData.reduce((prev:any, curr:GetPaperMarksForPupilItem) => {
        if (!prev[curr.classTag]){
          prev[curr.classTag] = {}
        }

        prev[curr.classTag][curr.paperId] = curr;

        return prev;
      }, {})
      
      // // console.log(JSON.stringify(pupilDetails, null, 2));
    return pupilDetails;

  }

  const {data: paperDataForPupil, error: paperDataForPupilError} = await supabase.rpc("fn_get_paper_data_for_pupil", {pupilid: userid});
  

  if (paperDataForPupilError) {
    return <pre>{JSON.stringify(paperDataForPupilError, null, 2)}</pre>
  } 

  const paperDataView = shapePaperData(paperDataForPupil);
    
  if (!paperDataView)
    return <div>No Data Found</div>

  return (
        <>
        <div className={styles.page}>
          
          <div className="page-header">
            <h1>Welcome, {paperDataView.firstName}  </h1> 
          </div>

          {
            Object.keys(paperDataView.classes).map((c, i) => <Card key={i} title="">
              
              <div className={styles.classTitle}>
                  
                  {// @ts-ignore

                  <Link href={`/app/spec-report/${userid}?classid=${Object.values(paperDataView.classes[c])[0].classId}`} className={styles.link}>{c}</Link>
                  }
              </div> 
              
              <div className={styles.paperDetails}>
                <div className={styles.paperCellHeader}>Paper</div>
                <div className={styles.paperCellHeader}>Available From</div>
                <div className={styles.paperCellHeader}>Complete By</div>
                <div className={styles.paperCellHeader}>Mark By</div>
                <div className={styles.paperCellHeader}>%</div>

                {
                Object.values(paperDataView.classes[c]).map((r , i) => 
                  
                  <>
                    
                    <div key={`${i}1`} className={styles.paperCell}>
                      {//@ts-ignore
                      <Link href={`/app/paper-form/${r.paperId}/${r.classId}`} className={styles.link}>{r.year}-{r.month}-{r.paper}</Link>
                      }
                    </div>
                    
                    
                    {//@ts-ignore
                    <div key={`${i}3`} className={styles.paperCell}>{r.availableFrom.substr(0, 10)}</div>
                    }
                    {//@ts-ignore
                    <div key={`${i}4`} className={styles.paperCell}>{r.completeBy.substr(0, 10)}</div>
                    }
                    {//@ts-ignore
                    <div key={`${i}5`} className={styles.paperCell}>{r.markBy.substr(0, 10)}</div>
                    }
                    {//@ts-ignore
                    <div key={`${i}6`} className={`${styles.paperCell} ${styles.right}`}>{((r.pMarks / r.qMarks)*100).toFixed(0)}%</div>
                    }
                  </>
                  )
              }</div>
              
              </Card>)
          }
          
          
          </div>
          
        </>
    )
}

export default MainPage;








