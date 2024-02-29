'use client'

import {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import supabase from 'components/supabase';

const Nav = () => {

    const [classes, setClasses] = useState<{ id: number; tag: string; }[] | null>(null)
    const router = useRouter()
     
    const handleOnChange = (id: string) => {
        router.push(`/test/${id}`)
    }

    const loadData = async() => {
        const {data, error} = await supabase.from("Classes").select("id, tag")

        error && console.error(error);

        data && setClasses(data);
    }


    useEffect(()=> {
        loadData()
    }, [])

    return <><select onChange={(e) => handleOnChange(e.target.value)}>
        {
            classes && classes.map((c, i) => <option key={i} value={c.tag}>{c.tag}</option>)
        }
    </select>
    </>
}

export default Nav;