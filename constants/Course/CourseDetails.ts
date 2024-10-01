import { Content } from "../Content/contentList";
  export interface Course {
    courseId: string;
    courseName: string;
    description: string;
    posterLink: string;
    createDate: string; // Hoặc Date nếu bạn xử lý dạng ngày
    videoIntro: string;
    userGenerated: string;
    price: string;
    category: string;
    contents: Content[];
  }
  