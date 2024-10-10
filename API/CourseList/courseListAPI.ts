
import axios from 'axios';
import { CoursePurchase } from '@/constants/CourseList/courseList';

export const getCourseListByEmail = async (email: string, token: string): Promise<CoursePurchase | null> => {
  try {
    const response = await axios.get<{ CoursePurchases: CoursePurchase }>(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/coursePurchased/getByEmail/${email}`, {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data && response.data.CoursePurchases) {
      return response.data.CoursePurchases;
    } else {
      console.error('Expected CoursePurchases but got something else');
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw new Error('Failed to get course list by email');
  }
};
