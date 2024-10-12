// api.ts
import axios from 'axios';
import { Result } from '@/constants/Quizz/result'; // Import interface

const API_URL = `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/quizz/result`;



export const getResults = async (token: string): Promise<Result[]> => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: token,
      },
    });
    if (response.data === null) {
      throw new Error('No result data was returned');
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Error fetching results: ' + error);
  }
};


export const storeResult = async (token: string, resultData: Result | null): Promise<any> => {
  if (!resultData) {
    throw new Error('Result data is null');
  }

  try {
    const response = await axios.post(API_URL, resultData , {
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
    throw new Error('Error saving result: ' + error);
  }
};


export const dropResults = async (token: string): Promise<any> => {
  try {
    const response = await axios.delete(API_URL, {
        headers: {
          Authorization: token,
        },
      })

    if (!response || !response.data) {
      throw new Error('No response from API');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Error deleting results: ' + error);
  }
};
