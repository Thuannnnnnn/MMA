
export interface Question {
    question: string;
    options: string[];
    answer: number;
    createdAt?: Date;
  }
  
  export interface QuestionResponse {
    questions: Question[];
  }
  