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

// Function to upload user avatar
export const uploadUserAvatar = async (userId: string, base64: string, token: string): Promise<any> => {
  // Ensure the base64 string is in the correct format
  const dataUrl = base64.startsWith('data:image/') ? base64 : `data:image/jpeg;base64,${base64}`;

  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/profile/upload-avatar/${userId}`,
      { avatarBase64: dataUrl }, // Send base64 string directly
      {
        headers: {
          'Authorization': token, // Set the token correctly
          'Content-Type': 'application/json', // Use JSON content type
        },
      }
    );

    return response.data; // Return data from response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to upload avatar');
  }
};

// Function to update user avatar
export const updateUserAvatar = async (userId: string, base64: string, token: string): Promise<any> => {
  const dataUrl = base64.startsWith('data:image/') ? base64 : `data:image/jpeg;base64,${base64}`;

  try {
    const response = await axios.put(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/profile/update-avatar/${userId}`,
      { avatarBase64: dataUrl }, // Send base64 string directly
      { 
        headers: { 
          'Authorization': token,
          'Content-Type': 'application/json', // Use JSON content type
        } 
      }
    );

    return response.data; // Return data from server
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to update avatar');
  }
};
