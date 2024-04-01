export type ClassPaper = {
    classId: number,
    paperId: number,
    paperTitle: string,
    classTag: string,
    availableFrom?: Date,
    completeBy?: Date,
    markBy?: Date,
    paperMarks: number,
    pupilMarks?: number
  }[]

export type ClassPapers = ClassPaper[];