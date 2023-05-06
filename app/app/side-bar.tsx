"use client";
import styles from "./side-bar.module.css"
import Link from "next/link";

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import GradingOutlinedIcon from '@mui/icons-material/GradingOutlined';
import FlashOnOutlinedIcon from '@mui/icons-material/FlashOnOutlined';

const SideBar = () => {
    return <div className={styles.sideBar}>
        <ul>
            <li><Link href="/"><HomeOutlinedIcon />Home</Link></li>
            <li><Link href="/"><ArticleOutlinedIcon />Past papers</Link></li>
            <li><Link href="/"><GradingOutlinedIcon />Analysis</Link></li>
            <li><Link href=""><FlashOnOutlinedIcon/>Flashcards</Link></li>
        </ul>
    </div>
}

export default SideBar;