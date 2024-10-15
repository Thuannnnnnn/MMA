import axios from 'axios';
import { Question } from '@/constants/Quizz/quizz';

const API_URL = `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/quizz/questions`;

export const fetchQuestions = async (token: string): Promise<Question[]> => {
  try {
    const response = await axios.get<Question[]>(API_URL, {
      headers: {
        Authorization: token,
      },
    });

    if (!response || !response.data) {
      throw new Error('Failed to fetch questions');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }

    throw error;
  }
};
