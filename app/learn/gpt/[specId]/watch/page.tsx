import { createSupabaseServerClient } from "app/utils/supabase/server";
import { DateTime } from "luxon";
import styles from "./page.module.css"
type Answers = {
    id: string;
    created_at: any;
    owner: string;
    isCorrect: boolean;
    Questions: {
        id: number;
        specItemId: number;
        SpecItem: {
            tag: string;
            title: string;
            SpecId: number;
        }[];
    }[];
}[] | null


type Users = {
    id: any;
    firstName: any;
    familyName: any;
}[] | null;


const Page = async ({params} : {params: {specId: number}})=> {

    const supabase = createSupabaseServerClient(false);

    if (!supabase){
        return <h1>Error: Supabase error</h1>
    }

    const {specId} = params;

    const {data: dataAnswers, error} = await supabase
                            .from("dqAnswers")
                            .select("id, created_at, owner, isCorrect, Questions!inner(id, specItemId, SpecItem!inner(tag, title, SpecId))")
                            .eq("Questions.SpecItem.SpecId", specId)
                            .gt("created_at", DateTime.now().startOf('day').toISO())
                            .order("created_at")
                            ;
    
    error && console.error(error);

    const {data: users, error: usersError} = await supabase.from("Profile").select("id, firstName, familyName");

    return <>
        <h1>Watching {specId}</h1>
        <DisplayAnswers answers={dataAnswers} users={users} />
    </>

}

export default Page;



const DisplayAnswers = (
    {answers, users} : 
    {answers: Answers, users: Users}
    ) => {

    console.log("Answers", answers);

    const userAnswers = answers?.map((a) => ({...a, 
        //@ts-ignore
        tag: a.Questions.SpecItem.tag,
        //@ts-ignore
        title: a.Questions.SpecItem.title,
        firstName: users?.filter(u => u.id === a.owner)[0]?.firstName || "No Profile Created", 
        familyName: users?.filter(u => u.id === a.owner)[0]?.familyName || "No Profile Created",
        Questions: null
    }));

    console.log("userAnswers", userAnswers);

    let usersWithAnswers = new Set(answers?.map((a) => a.owner))

    const matchedUsers = [...usersWithAnswers].reduce((prev, curr)=> {
        const matchingUser = users?.filter(u => u.id == curr)[0];

        //@ts-ignore
        prev[curr] = {firstName: matchingUser?.firstName, familyName: matchingUser?.familyName}

        return prev
    }, {});

    const groupedOwners = userAnswers?.reduce((prev, curr) => {

        
        prev[curr.owner] = prev[curr.owner] || []
        
        prev[curr.owner].push(curr);

        return prev;

    }, {} as {[key : string] : any});

    return <>
        <h1>Hello</h1>
        <div className={styles.displayPupils}>

        {//@ts-ignore
        Object.values(groupedOwners).map((go, i) => <DisplayAnaswersForPupil key={i} ownerAnswers={go}/>)}
        </div>
    </>
}

//@ts-ignore
const DisplayAnaswersForPupil = ({ownerAnswers} : {ownerAnswers:{
    "id": string,
    "created_at": Date,
    "owner": string,
    "isCorrect": boolean,
    "Questions": boolean,
    "tag": string,
    "title": string,
    "firstName": string,
    "familyName": string
  }}[]) => {
    return <div className={styles.displayPupil}>
            <h3>{ownerAnswers[0].firstName} {ownerAnswers[0].familyName}</h3>

            <div>{ownerAnswers[0].tag} :: { //@ts-ignore
            ownerAnswers.filter(oa => oa.isCorrect).length} Correct, {ownerAnswers.filter(oa => !oa.isCorrect).length} Inorrect,</div>
            

        </div>
}