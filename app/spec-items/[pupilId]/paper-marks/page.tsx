const Page = async ({params} : {params : {pupilId : string, classId: number, paperId: number}}) => {
    const {pupilId, classId, paperId} = params;

    return <>Questions Page for: {pupilId}, {classId}, {paperId}</>
}

export default Page;