"use client";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';

import Link from "next/link";

import styles from "./card-button.module.css"

const CardButton = ({title, href}:{title : string, href: string}) => {

    const getIcon = (title: string) => {
        switch (title) {
            case "Dashboard" : return <DashboardOutlinedIcon sx={{fontSize: 80}}/>;
            case "Profile" : return <AccountBoxOutlinedIcon sx={{fontSize: 80}}/>;
        }
    } 

    return <div className={styles.card}>
    {getIcon(title)}
    <Link href={href}>{title}</Link>
    </div>;
}

export default CardButton;