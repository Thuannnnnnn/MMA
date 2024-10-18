import axios from 'axios';
import { Question } from '@/constants/Quizz/quizz';

const API_URL = `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/quizz/questions`;

export const fetchQuestions = async (token: string, contentRef: string): Promise<Question[]> => {
  try {
    if (!contentRef || typeof contentRef !== 'string') {
      throw new Error('Invalid contentRef');
    }

    const response = await axios.get<Question[]>(`${API_URL}/${contentRef}`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response || !response.data) {
      throw new Error('Failed to fetch questions');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(error.response?.data?.error || 'Questions not found');
    }

    throw error;
  }
};

