// File: FeedbackAPI.ts

import axios from 'axios';
import { Feedback } from '@/constants/Feedback/Feedback';

const API_BASE_URL = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Create feedback
export const createFeedback = async (
  courseId: string,
  userEmail: string,
  ratingPoint: number,
  feedbackText: string,
  token: string
): Promise<Feedback> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/feedback/createFeedback`,
      { courseId, userEmail, ratingPoint, feedbackText },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to create feedback');
  }
};

// Get feedback by user email
export const getFeedbackByUserEmail = async (
  email: string,
  token: string
): Promise<Feedback[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/feedback/getFeedbackByUserEmail/${email}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to get feedback by user email');
  }
};

// Get all feedback
export const getAllFeedback = async (token: string): Promise<Feedback[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/feedback/getAllFeedback`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to get all feedback');
  }
};

// Get feedback by course ID
export const getFeedbackByCourseId = async (
  courseId: string,
  token: string
): Promise<Feedback[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/feedback/getFeedbackByCourseId/${courseId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to get feedback by course ID');
  }
};

// Update feedback by ID
export const updateFeedback = async (
  id: string,
  courseId: string,
  userEmail: string,
  ratingPoint: number,
  feedbackText: string,
  token: string
): Promise<Feedback> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/feedback/create/${id}`,
      { courseId, userEmail, ratingPoint, feedbackText },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to update feedback');
  }
};

// Delete feedback by ID
export const deleteFeedback = async (id: string, token: string): Promise<any> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/feedback/delete/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to delete feedback');
  }
};
