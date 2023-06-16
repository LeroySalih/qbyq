import styles from "./card.module.css";
import { ReactNode, PropsWithChildren } from "react";

type CardProps = {
    title?: string
}

const Card = (props: PropsWithChildren<CardProps> ) => {

    return <>
    <div className={styles.card}>
        {props.title && <div className={styles.title}>{props.title}</div> }
        <div className={styles.body}>
            {props.children}
        </div>
    </div>
</>
}


export default Card;