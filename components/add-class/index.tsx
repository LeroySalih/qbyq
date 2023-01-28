
import supabase from "components/supabase";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import {useState, useEffect, ChangeEventHandler, ChangeEvent} from 'react';

import { getClassByTag, GetClassByTagResponseType } from "lib";


export type OnAddHandler = (arg1: GetClassByTagResponseType) => void;

export type AddClassProps = {
    onAdd : OnAddHandler
}

const AddClass = ({onAdd}:AddClassProps) => {

    const [classTag, setClassTag] = useState<string | undefined>();
    const [joinClass, setJoinClass] = useState<GetClassByTagResponseType>();

    const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
        setClassTag(e.target.value)
        setJoinClass(undefined);
    }

    const handleCheckClick = async () => {

        const data = await getClassByTag(classTag);
        setJoinClass(data);

    }

    const handleAddClick = async () => {

        onAdd(joinClass);

    }

    return <>
        <div>
            <InputText value={classTag} onChange={handleTagChange}/>
            <Button disabled={classTag === undefined || classTag.length === 0} onClick={handleCheckClick}>Check</Button>
            <Button disabled={joinClass === undefined || joinClass=== null} onClick={handleAddClick}>Add</Button>
        </div>
        <div>
            {joinClass === null && `No class found.`}

            {joinClass && `Joining ${joinClass.title}`}
        </div>
    </>
}

export default AddClass; 