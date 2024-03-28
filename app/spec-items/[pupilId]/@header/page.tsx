const Page = async ({params} : {params : {pupilId : string}}) => {
    const {pupilId} = params;
    return <h1>Header for {pupilId}</h1>
}
export default Page;