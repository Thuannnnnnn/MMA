// constants/Quiz/quizResult.ts

export interface QuizResult {
    quizId: string;
    userId: string;
    answers: Answer[];
    submissionTime: Date;
  }
  
  export interface Answer {
    questionId: string;
    selectedOption: string;
    isCorrect?: boolean; 
  }
  