export interface ContentDetail {
    contentId: string;
    contentName: string;
    contentType: string;
    contentRef: string;
    createDate: string;
  }
  
  export interface CourseDetail {
    _id: string;
    courseId: string;
    courseName: string;
    description: string;
    posterLink: string;
    createDate: string;
    videoIntro: string;
    userGenerated: string;
    price: string;
    category: string;
    contents: ContentDetail[];
    __v: number;
  }
  
  export interface CoursePurchase {
    _id: string;
    userEmail: string;
    purchaseId: string;
    courses: {
      courseId: CourseDetail | null;
      _id: string;
      purchaseDate: string;
    }[];
  }
  