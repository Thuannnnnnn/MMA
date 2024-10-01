import axios from 'axios';
import { paymentUrl } from '@/constants/Payment/payment';

export const getPaymentUrl= async (amount: paymentUrl, token: string): Promise<paymentUrl> => {
  try {
    const response = await axios.post<paymentUrl>(`http://192.168.1.24:8080/api/payment/create`,amount, {
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
