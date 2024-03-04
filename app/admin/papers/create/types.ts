
export type Question = {
    id: number,
    questionNumber: string;
    marks: number | null;
    paperId: number | null;
    specItemId: number | null;
    questionOrder: number | null;
  }

export type FormValues = {
    id: number;
    year: string;
    spec: number;
    paperId: number;
    questions: Question[];
  };