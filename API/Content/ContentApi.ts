import axios from 'axios';
import { Course } from '@/constants/Content/contentList';

export const getContentById = async (contentId: string, token: string): Promise<Course> => {
  try {
    const response = await axios.get<Course>(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/course/getContentByCourseId/${contentId}`, {
      headers: {
        Authorization: token
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to get content by ID');
  }
};
