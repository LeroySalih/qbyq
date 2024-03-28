import getHeader from "./header";

const Page = async ({params} : {params : {pupilId : string}}) => {
    const {pupilId} = params;

    const header = await getHeader(pupilId);

    return <>{header}</>
}
export default Page;  