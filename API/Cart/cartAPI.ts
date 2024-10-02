import { Cart } from '@/constants/Cart/cartList';
import axios from 'axios';


export const getAllCartByEmail = async (Email: string, token: string): Promise<Cart> => {
  try {
    const response = await axios.get<Cart>(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/cart/getByEmail/`, {
      headers: {
        Authorization: token
      },
      params: {
        userGenerated: Email,
      },
    }); 

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to get Email');
  }
};

export const deleteById = async (cartId: string, token: string, courseId: string): Promise<Cart> => {
  try {
    const response = await axios.post<Cart>(`http://192.168.1.14:3030/api/cart/deteleCourseOutCart`, {
      cartId: cartId,
      courseId: courseId,
    }, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json', // Có thể thêm header này nếu cần
      },
    }); 

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to delete course from cart');
  }
};

export const addToCart = async (cartId: string, token: string, courseId: string): Promise<Cart> => {
  try {
    const response = await axios.post<Cart>(`http://192.168.1.14:3030/api/cart/addToCart`, {
      headers: {
        Authorization: token
      },
      data: {
        cartId: cartId,
        courseId: courseId,
      },
    }); 

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to add cart');
  }
};
