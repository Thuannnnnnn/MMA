export interface Course {
    courseName: string;
    purchaseDate: string;
  }
  
  export interface OrderHistory {
    _id: string;
    orderId: string;
    userEmail: string;
    price: number;
    courses: Course[];  
  }
  