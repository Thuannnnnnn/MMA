import axios from 'axios';
import { UserInfo } from '@/constants/Profile/userInfo';
import { UserPassword } from '@/constants/Profile/userPassword';


export const updateProfile = async (userId: string, userInfo: UserInfo, token: string): Promise<any> => {
  try {
    const response = await axios.put(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/profile/update-bio/${userId}`, userInfo,
       { headers: { Authorization: token,
        'Content-Type': 'application/json',
        } });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to update profile');
  }
};

export const updatePassword = async (userId: string, password : UserPassword, token: string): Promise<any> => {
  try {
    const response = await axios.put(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/profile/update-password/${userId}`, password,
      
      
    { headers: { Authorization: token } });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to update password');
  }
};

export const getUserInfo = async (userId: string, token: string): Promise<UserInfo> => {
  try {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/profile/user-info/${userId}`,
        { headers: { Authorization: token } }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to fetch user info');
  }
};


export const uploadUserAvatar = async (userId: string, file: File, token: string): Promise<any> => {
  try {
    const formData = new FormData();
    const blob = new Blob([file], { type: file.type });
    formData.append('avatar', blob, file.name);

    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/profile/upload-avatar/${userId}`,
      formData,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
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
    throw new Error('Failed to upload avatar');
  }
};

