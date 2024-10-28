export interface Reply {
  replyId: string;     // ID của câu trả lời (Mongoose _id)
  repliedBy: string;   // Email của người trả lời
  replyText: string;   // Nội dung câu trả lời
  createDate: string;  // Ngày tạo câu trả lời
}

export interface QandA {
  _id: string;         // ID của feedback (Mongoose _id)
  courseId: string;    // ID của khóa học
  userEmail: string;   // Email của người gửi feedback
  QandAText: string;// Nội dung của feedback
  createDate: string;  // Ngày tạo feedback

  replies?: Reply[];   // Mảng chứa các câu trả lời, có thể không có (dùng dấu ? để tùy chọn)
}
