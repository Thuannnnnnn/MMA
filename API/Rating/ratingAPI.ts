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
): Promise<number> => {
  try {
    const response = await axios.get<{ averageRating: number }>(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/rating/course/${courseId}/average`,
      {
        headers: { Authorization: token },
      }
    );
    return response.data.averageRating || 0;
  } catch (error) {
    
    return 0;
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
): Promise<boolean> => {
  try {
    const response = await axios.get<{ hasProvidedFeedbackAndRating: boolean }>(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/rating/has-provided/${userEmail}/${courseId}`,
      {
        headers: { Authorization: token },
      }
    );
    return response.data.hasProvidedFeedbackAndRating || false;
  } catch (error) {
    
    return false;
  }
};

export const getRatingByUserEmail = async (
  userEmail: string,
  token: string
): Promise<Rating[]> => {
  try {
    const response = await axios.get<Rating[]>(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/rating/userRating/${userEmail}`,
      {
        headers: { Authorization: token },
      }
    );
    return response.data || [];
  } catch (error) {
    
    return [];
  }
};

export const getRatingsCountByType = async (courseId: string, token: string) => {
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/rating/course/${courseId}/ratings-count`,
      {
        headers: { Authorization: token },
      }
    );
    return response.data || [0, 0, 0, 0, 0];
  } catch (error) {
    
    return [0, 0, 0, 0, 0];
  }
};

// Update an existing rating
export const updateRating = async (
  ratingId: string,
  ratingPoint: number,
  feedback: string,
  token: string
): Promise<Rating | null> => {
  try {
    const response = await axios.put<Rating>(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/rating/${ratingId}`,
      { ratingPoint, feedback },
      {
        headers: { Authorization: token },
      }
    );
    return response.data;
  } catch (error) {
    
    return null;
  }
};