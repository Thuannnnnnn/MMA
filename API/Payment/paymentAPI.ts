import axios from 'axios';
import { paymentUrl } from '@/constants/Payment/payment';

export const getPaymentUrl= async (amount: number, token: string): Promise<paymentUrl> => {
  try {
    const response = await axios.post<paymentUrl>(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/payment/create`,{ amount }, {
      headers: {
        Authorization: token
      }
    } );

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

export const creatOrder = async (userEmail: string, price: number, courses:string, token: string) => {
  try {
    const response = await axios.post(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/order/create`,{userEmail, price, courses }, {
      headers: {
        Authorization: token
      }
    } );

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