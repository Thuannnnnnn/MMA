import axios from 'axios';
import { Rating } from '@/constants/Rating/Rating';

export const createRating = async (
  userEmail: string,
  ratingPoint: number,
  courseId: string,
  feedback: string,
  token: string
): Promise<Rating | null> => {
  try {
    
    const response = await axios.post<Rating>(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/rating/`,
      { userEmail, ratingPoint, courseId, feedback },
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to create rating');
    return null;
  }
};


// Lấy điểm trung bình cho một khóa học
export const getAverageRatingForCourse = async (
  courseId: string,
  token: string
): Promise<number | null> => {
  try {
    const response = await axios.get<{ averageRating: number }>(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/rating/course/${courseId}/average`,
      {
        headers: { Authorization: token },
      }
    );
    return response.data.averageRating;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch average rating for course');
    return null;
  }
};



// Hàm xử lý lỗi chung cho các API
const handleAxiosError = (error: unknown, defaultMessage: string) => {
  if (axios.isAxiosError(error)) {
    console.error(`${defaultMessage}:`, error.response?.data || error.message);
  } else {
    console.error(`Unexpected error:`, error);
  }
};


export const hasUserProvidedFeedbackAndRating = async (
  userEmail: string,
  courseId: string,
  token: string
): Promise<boolean | null> => {
  try {
    const response = await axios.get<{ hasProvidedFeedbackAndRating: boolean }>(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/rating/has-provided/${userEmail}/${courseId}`,
      {
        headers: { Authorization: token },
      }
    );
    return response.data.hasProvidedFeedbackAndRating;
  } catch (error) {
    handleAxiosError(error, 'Failed to check if user has provided feedback and rating');
    return null;
  }
};

export const getRatingByUserEmail = async (
  userEmail: string,
  token: string
): Promise<Rating[] | null> => {
  try {
    const response = await axios.get<Rating[]>(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/rating/userRating/${userEmail}`,
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch ratings by user email');
    return null;
  }
};

export const getRatingsCountByType = async (courseId: string, token: string) => {
  try {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/rating/course/${courseId}/ratings-count`,
    {
      headers: { Authorization: token },
    }
  );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to fetch ratings count');
  }
};