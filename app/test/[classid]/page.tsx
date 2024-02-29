

const Page = ({params}: {params: {classid: string}}) => {
    const {classid} = params;

    return <h1>Summary Report for {classid}</h1>
}


export default Page;