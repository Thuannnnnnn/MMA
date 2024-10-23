import axios from 'axios';
import { QandA } from '@/constants/QandA/QandA';

const API_BASE_URL = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Create QandA
export const createQandA = async (
  courseId: string,
  userEmail: string,
  QandAText: string,
  token: string
): Promise<QandA> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/QandA/createQandA`,
      { courseId, userEmail, QandAText },
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
    throw new Error('Failed to create QandA');
  }
};

// Get QandA by user email
export const getQandAByUserEmail = async (
  email: string,
  token: string
): Promise<QandA[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/QandA/getQandAByUserEmail/${email}`,
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
    throw new Error('Failed to get QandA by user email');
  }
};

// Get all QandA
export const getAllQandA = async (token: string): Promise<QandA[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/QandA/getAllQandA`, {
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
    throw new Error('Failed to get all QandA');
  }
};

// Get QandA by course ID
export const getQandAByCourseId = async (
  courseId: string,
  token: string
): Promise<QandA[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/QandA/getQandAByCourseId/${courseId}`,
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
    throw new Error('Failed to get QandA by course ID');
  }
};


// Update QandA by ID
export const updateQandA = async (
  id: string,
  courseId: string,
  userEmail: string,
  QandAText: string,
  token: string
): Promise<QandA> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/QandA/create/${id}`,
      { courseId, userEmail, QandAText },
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
    throw new Error('Failed to update QandA');
  }
};

// Delete QandA by ID
export const deleteQandA = async (id: string, token: string): Promise<any> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/QandA/delete/${id}`, {
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
    throw new Error('Failed to delete QandA');
  }
};

// Reply to QandA
export const replyToQandA = async (
  QandAId: string,
  replyText: string,
  repliedBy: string,
  token: string
): Promise<QandA> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/QandA/reply/${QandAId}`,
      { replyText, repliedBy },
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
    throw new Error('Failed to reply to QandA');
  }
};

// Delete a QandA reply by QandAId and replyId
export const deleteQandAReply = async (
  QandAId: string,
  replyId: string,
  token: string
): Promise<any> => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/QandA/deleteReply/${QandAId}/${replyId}`,
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
    throw new Error('Failed to delete QandA reply');
  }
};






