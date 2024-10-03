import { Cart, Res } from '@/constants/Cart/cartList';
import axios from 'axios';


export const getAllCartByEmail = async (Email: string, token: string): Promise<Cart> => {
  try {
    const response = await axios.get<Res>(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/cart/getByEmail/`, {
      headers: {
        Authorization: token
      },
      params: {
        userGenerated: Email,
      },
    });
    const Cart = response.data.Cart;
    console.log(Cart);
    return Cart;
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
    const response = await axios.post<Cart>(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/cart/deteleCourseOutCart`, {
      cartId: cartId,
      courseId: courseId,
    }, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
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

export const deleteCourseOrder = async (
  cartId: string,
  token: string,
  courses: Array<{ courseId: string }>
): Promise<Cart> => {
  try {
    const courseIds = courses.map((course) => course.courseId).join(','); // Convert courseIds array to comma-separated string
    
    const response = await axios.delete<Cart>(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/cart/deteleCourseOrder`,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        params: {
          cartId,
          courseIds, // Send courseIds as query params
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
    throw new Error('Failed to delete course from cart');
  }
};


export const addToCart = async (cartId: string, token: string, courseId: string): Promise<Cart> => {
  try {
    const response = await axios.post<Cart>(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/cart/addToCart`, {
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
