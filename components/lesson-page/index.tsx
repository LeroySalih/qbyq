import { JsxElement } from "typescript";
import styles from "./lesson-page.module.css";
import { ReactNode } from "react";
import Image from "next/image";

export const LessonPage = ({children} : {children : ReactNode | ReactNode[]}) => {

    return <div className={styles.layoutPage}>{children}</div>

}

export const LessonTitle = ({children} : {children : ReactNode | ReactNode[]}) => {
    return <h1>{children}</h1>
}

export const LessonObjective = ({children} : {children : ReactNode | ReactNode[]}) => {
    return <h3>{children}</h3>
}

export const LessonTasks = ({children} : {children : ReactNode | ReactNode[]}) => {
    return <div>
            <h2>Lesson Tasks</h2>
            <div>{children}</div>
           </div>
}

export const LessonTask = ({children} : {children : ReactNode | ReactNode[]}) => {
    return <div>{children}</div>
}

export const LessonSection = ({children} : {children : ReactNode | ReactNode[]}) => {
    return <div className={styles.lessonSection}>{children}</div>
}

export const LessonSectionTitle = ({children} : {children : ReactNode | ReactNode[]}) => {
    return <h2>{children}</h2>
}

export const LessonSectionContent = ({children} : {children : ReactNode | ReactNode[]}) => {
    return <div>{children}</div>
}

export type LessonImageType = {
    src: string,
    width: number,
    height: number,
    alt: string
}
export const LessonImage = ({src, width, height, alt} : LessonImageType) => {
    return <div className={styles.ImageContainer}><Image src={src} width={width} height={height} alt={alt} /></div>
}