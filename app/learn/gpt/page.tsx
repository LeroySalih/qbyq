import Link from "next/link";

import { createSupabaseServerClient } from "app/utils/supabase/server";
import styles from "./page.module.css";

const Page = async () => {

    const supabase = createSupabaseServerClient(false);

    if (!supabase){
        return <h1>Superbase not created</h1>
    }

    const {data, error} = await supabase?.from("dqPage").select("id, title, SpecItem(tag, title)");

    if( error) {
        return <h1>Error: no links returned</h1>
    }

    const links = data.reduce((prev, cur) => { 
        // @ts-ignore
        if (!(cur.SpecItem?.tag in prev)) {

            // @ts-ignore
            prev[cur.SpecItem.tag] = {title: cur.SpecItem.title, items: []}
        }

        // @ts-ignore
        prev[cur.SpecItem.tag].items.push({tag: cur.SpecItem.tag, title: cur.title, code: cur.id})

        return prev;
    }, {})

    return <div className={styles.layout}>
        
        <h1>Links</h1>

        <div className={styles.linkTable}>
        {
        //@ts-ignore
        Object.keys(links)
            .sort((a, b) => a > b ? 1 : -1)
            .map((k, index) => {
                //@ts-ignore
                return [<h3 key={`title-${index}`}>{k} - {links[k].title}</h3>, <div key={`links-${index}`}>  {...links[k].items.map((l, i) => <div key={i}><Link href={`/learn/gpt/${l.code}`}>{l.title}</Link></div>)} </div>]
            })
        }

        </div>
        
        
        </div>
}

export default Page;