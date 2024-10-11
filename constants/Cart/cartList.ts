export interface CartItemContent {
  contentId: string;
  contentName: string;
  contentType: string;
  contentRef: string;
  createDate: string;
}

export interface Course {
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
  contents: CartItemContent[];
  __v: number;
}

export interface CartItem {
  _id: string;
  courseId: Course;
  updateDate: string;
}

export interface Cart {
  _id: string;
  cartId: string;
  courses: CartItem[];
  userGenerated: string;
  __v: number;
}

export interface Res {
  Cart: Cart;
  Message: string;
}