

const Page = ({params}: {params: {classid: string}}) => {
    const {classid} = params;

    return <h1>Summary Report for {classid}</h1>
}

///workspaces/qbyq/app/test/classes/[classid]/page.tsx
export default Page;