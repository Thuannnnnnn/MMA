import axios from 'axios';
import { UserInfo } from '@/constants/Profile/userInfo';
import { UserAvatar } from '@/constants/Profile/userAvatar';
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

export const getUserAvatar = async (userId: string, token: string): Promise<UserAvatar> => {
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/profile/user-avatar/${userId}`,
      { headers: { Authorization: token } }
    );
    const avatarMessage = response.data.message;
    if (avatarMessage === 'avatar is null') {
      return { avatarUrl: null };
    }
    const avatarUrl = response.data.avatarUrl;
    return { avatarUrl };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    return { avatarUrl: null };
  }
};


export const uploadUserAvatar = async (userId: string, file: File, token: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

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
    throw new Error('Failed to upload user avatar');
  }
};


export const updateUserAvatar = async (userId: string, file: File, token: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.put(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/profile/update-avatar/${userId}`,
      formData,
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
    throw new Error('Failed to update avatar');
  }
};

