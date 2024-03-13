const Page = async () => {

    const getData = async (): Promise<string> => {
        return new Promise ((res, rej) => {
            setTimeout(()=> res("Hello!"), 1000)
        })
    }

    const result = await getData();

    return <h1>Users, {result}</h1>
}

export default Page;