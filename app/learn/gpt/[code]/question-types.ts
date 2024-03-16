
export type Question = {
    id: number;
    question_text: any;
    choices: any;
    correct_answer: any;
  }

export type Questions = Question[] | undefined;