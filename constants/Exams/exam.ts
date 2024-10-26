  // exam.ts
export interface Question {
    _id: string;
    contentId: string;
    question: string;
    options: string[];
    answer: number;
    createdAt: string;
  }
  
  export interface Exam {
    _id: string; 
    courseId: string; 
    questionNumber: number; 
    questions: Question[]; 
    createdAt?: string; 
  }
  