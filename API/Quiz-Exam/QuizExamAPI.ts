import axios from 'axios';
import { QuizInfo } from '@/constants/QuizExam/quizInfo';
import { QuizResult } from '@/constants/QuizExam/quizResult';
// Bắt đầu kỳ thi
export const startQuizExam = async (quizInfo: QuizInfo): Promise<any> => {
  try {
    const response = await axios.post('http://192.168.1.24:8080/api/quiz/start', quizInfo);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to start quiz exam');
  }
};

// Gửi kết quả kỳ thi
export const submitQuizExam = async (quizResult: QuizResult): Promise<any> => {
  try {
    const response = await axios.post('http://192.168.1.24:8080/api/quiz/submit', quizResult);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to submit quiz exam');
  }
};

// Lấy kết quả kỳ thi
export const getQuizResult = async (quizId: string): Promise<any> => {
  try {
    const response = await axios.get(`http://192.168.1.24:8080/api/quiz/result/${quizId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to get quiz result');
  }
};
