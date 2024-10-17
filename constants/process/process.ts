export interface ProcessContent {
    contentId: string;  // ID của nội dung (content)
    isComplete: boolean; // Trạng thái hoàn thành của nội dung
  }
  
  export interface Process  {
    processId: string;           // ID của quá trình
    courseId: string;            // ID của khóa học liên quan
    email: string;               // Email của người dùng
    content: ProcessContent[];   // Danh sách nội dung trong quá trình
  }
  