"use client"
type PaperFormParams = {
    params : {
        paperId: string
    }
}
const PaperForm = ({params}:PaperFormParams) => {
    console.log(params)
    return <h1>Showing Data For {params.paperId}</h1>
}

export default PaperForm;