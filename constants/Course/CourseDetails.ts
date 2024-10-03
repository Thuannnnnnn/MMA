import { Content } from "../Content/contentList";
  export interface Course {
    courseId: string;
    courseName: string;
    description: string;
    posterLink: string;
    createDate: string;
    videoIntro: string;
    userGenerated: string;
    price: string;
    category: string;
    contents: Content[];
  }
  