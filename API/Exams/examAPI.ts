import axios from 'axios';
import { Exam } from '@/constants/Exams/exam';
import { ExamResults } from '@/constants/Exams/examResults';

const API_URL = `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/exams`;

// Fetch all exams for a specific course
export const fetchExams = async (token: string, courseId: string): Promise<Exam[]> => {
  try {
    if (!courseId || typeof courseId !== 'string') {
      throw new Error('Invalid courseId');
    }
    const response = await axios.get<Exam[]>(`${API_URL}/${courseId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response || !response.data) {
      throw new Error('Failed to fetch exams');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(error.response?.data?.error || 'Exams not found');
    }
    throw error;
  }
};

// Fetch a specific exam by courseId
export const fetchExamByCourseId = async (token: string, courseId: string): Promise<Exam> => {
  try {
    if (!courseId || typeof courseId !== 'string') {
      throw new Error('Invalid courseId');
    }
    const response = await axios.get<Exam>(`${API_URL}/course/${courseId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response || !response.data) {
      throw new Error('Failed to fetch exam');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(error.response?.data?.error || 'Exam not found for this course');
    }
    throw error;
  }
};

// Submit exam attempt with courseId
export const submitExam = async (
  token: string,
  courseId: string,
  examId: string,
  userEmail: string,
  answers: number[]
): Promise<ExamResults> => {
  try {
    if (!examId || typeof examId !== 'string') {
      throw new Error('Invalid examId');
    }
    if (!userEmail || typeof userEmail !== 'string') {
      throw new Error('Invalid userEmail');
    }
    if (!Array.isArray(answers) || answers.length === 0) {
      throw new Error('Answers must be a non-empty array');
    }

    const response = await axios.post(
      `${API_URL}/submit`,
      { courseId, examId, userEmail, answers },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (!response || !response.data) {
      throw new Error('Failed to submit exam');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(error.response?.data?.error || 'Exam not found');
    }
    throw error;
  }
};
// Get exam result by courseId and userEmail
export const getExamResultByUser = async (
  token: string,
  courseId: string,
  userEmail: string
): Promise<ExamResults> => {
  try {
    if (!courseId || typeof courseId !== 'string') {
      throw new Error('Invalid courseId');
    }
    if (!userEmail || typeof userEmail !== 'string') {
      throw new Error('Invalid userEmail');
    }

    const response = await axios.get<ExamResults>(`${API_URL}/result/${courseId}/${userEmail}`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response || !response.data) {
      throw new Error('Failed to fetch exam result');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(error.response?.data?.error || 'Exam result not found for this course and user');
    }
    throw error;
  }
};

// Check if a user has attempted a specific exam
export const hasUserAttemptedExamAPI = async (
  token: string,
  examId: string,
  userEmail: string
): Promise<boolean> => {
  try {
    if (!examId || typeof examId !== 'string') {
      throw new Error('Invalid examId');
    }
    if (!userEmail || typeof userEmail !== 'string') {
      throw new Error('Invalid userEmail');
    }

    const response = await axios.get<{ attempted: boolean }>(`${API_URL}/${examId}/${userEmail}/attempted`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response || response.data.attempted === undefined) {
      throw new Error('Failed to fetch attempt status');
    }

    return response.data.attempted;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      throw new Error('Error checking attempt status');
    }
    throw error;
  }
};
