export interface Video {
  _id: string;
  videoId: string;
  title: string;
  videoLink: string;
  uploadDate: string;
}
export interface Docs {
  _id: string;
  docsId: string;
  title: string;
  docsLink: string;
  uploadDate: string;
}

interface ExamQuestion {
  questionText: string;
  answers: ExamAnswer[];
}

interface ExamAnswer {
  answerText: string;
  isCorrect: boolean;
  _id: string;
}

interface Exam {
  _id: string;
  examId: string;
  courseId: string;
  content: ExamQuestion[];
  createdAt: string;
  updatedAt: string;
}

interface Question {
  _id: string;
  contentId: string;
  question: string;
  options: string[];
  answer: number;
  createdAt: string;
}

export type Content =
  | {
      contentId: string;
      contentName: string;
      contentType: "videos";
      contentRef: Video;
      _id: string;
      createDate: string;
    }
  | {
      contentId: string;
      contentName: string;
      contentType: "exams";
      contentRef: Exam;
      _id: string;
      createDate: string;
    }
  | {
      contentId: string;
      contentName: string;
      contentType: "questions";
      contentRef: Question;
      _id: string;
      createDate: string;
    }
  | {
      contentId: string;
      contentName: string;
      contentType: "docs";
      contentRef: Docs;
      _id: string;
      createDate: string;
    };
export interface Course {
  courseId: string;
  courseName: string;
  contents: Content[];
  _id: string;
  createDate: string;
}
