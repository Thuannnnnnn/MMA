export interface Result {
  _id: string;
  achieved: string;
  attempts: number;
  createdAt: string;
  points: number;
  quizId: string;
  result: Array<{
    options: any;
    correctAnswer: string;
    question: string;
    selectedAnswer: string | null;
  }>;
  selectedItemId: string | null; // Đảm bảo kiểu dữ liệu này chính xác
}
