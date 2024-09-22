import axios from 'axios';
import { UserEmail } from '@/constants/ForgotPassword/userEmail';
import { UserOtp } from '@/constants/ForgotPassword/userOtp';
import { UserPassword } from '@/constants/ForgotPassword/userPassword';

export const sendOtpForgotPassword = async (user: UserEmail): Promise<any> => {
    try {
      const response = await axios.post('http://192.168.1.8:8080/api/auth/fogot-password', user);
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        
        console.error('Axios error:', error.response?.data || error.message);
      } else {
        console.error('Error:', error);
      }
      throw new Error('Failed to send OTP registration');
    }
  };

  export const validateOtp = async (user: UserOtp): Promise<any> => {
    try {
      const response = await axios.post('http://192.168.1.8:8080/api/auth/validate-otp', user);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
       
        console.error('Axios error:', error.response?.data || error.message);
      } else {
        console.error('Error:', error);
      }
      
      throw new Error('Failed to send OTP registration');
    }
  };
  
  export const ForgotPassword = async (user: UserPassword): Promise<any> => {
    try {
      const response = await axios.post('http://192.168.1.8:8080/api/auth/change-password', user);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
          
            console.error('Axios error:', error.response?.data || error.message);
        } else {
            console.error('Error:', error);
        }
        throw new Error('Failed to send OTP registration');
        }
    }