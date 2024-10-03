import axios from 'axios';
import { UserEmail } from '@/constants/SignUp/userEmail';
import { UserOtp } from '@/constants/SignUp/userOtp';
import { UserInfo } from '@/constants/SignUp/userInfo';

export const sendOtpRegister = async (user: UserEmail): Promise<any> => {
  try {
    const response = await axios.post('http://192.168.101.11:8080/api/auth/sendOtpRegister', user);
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
    const response = await axios.post('http://192.168.101.11:8080/api/auth/validate-otp', user);
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
export const signUp = async (user: UserInfo): Promise<any> => {
  try {
    const response = await axios.post('http://192.168.101.11:8080/api/auth/register', user);
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