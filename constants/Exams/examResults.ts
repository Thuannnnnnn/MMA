export interface Answer {
    questionId: string;
    selectedAnswer: number;
  }
  
  export interface ExamResults {
    courseId: string;
    examId: string;
    userEmail: string;
    answers: Answer[];
    score: number;
    passed: boolean;
    attemptDate?: string;
  }
  