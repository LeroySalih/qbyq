"use client";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Link from "next/link";

import styles from "./card-button.module.css"

const CardButton = ({title, href}:{title : string, href: string}) => {
    return <div className={styles.card}>
    <DashboardOutlinedIcon sx={{ fontSize: 80 }}/>
    <Link href={href}>{title}</Link>
    </div>;
}

export default CardButton;