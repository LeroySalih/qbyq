const Page = async () => {
    const getData = async (): Promise<string> => {
        return new Promise ((res, rej) => {

            setTimeout(()=> res("Hello!" + Math.random().toString()), 5000)
        })
    }

    const result = await getData();

    return <h1>Results, {result}</h1>
}

export default Page;