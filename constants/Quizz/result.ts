export interface Result {
    _id?: string;
    result: any[]; 
    attempts: number;
    points: number;
    achieved: string;
    createdAt?: Date;
  }