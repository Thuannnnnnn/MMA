// constants/Quiz/quizInfo.ts

export interface QuizInfo {
    quizId: string;
    userId: string;
    startTime: Date;
    duration: number; // in minutes
    questions: QuestionInfo[];
  }
  
  export interface QuestionInfo {
    questionId: string;
    questionText: string;
    options: string[];
  }
  