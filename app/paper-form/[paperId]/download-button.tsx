
import supabase from "components/supabase";
import { Button } from "primereact/button";


const ExportButton = () => {

    const handleClick = async () => {
        // Use the JS library to download a file.
        const { data, error } = await supabase.storage.from('exam-papers').download('computer-science/9210-international-gcse-computer-science-question-paper-2-v1.0.pdf')

        error && console.error(error);
        console.log(data)
    }

    return <Button onClick={handleClick}>Download</Button>
}


export default ExportButton;