import {OrderHistory} from "@/constants/OrderHistory/orderHistory";
import axios from 'axios';

export const getOrderHistory = async (email: string, token: string): Promise<OrderHistory[]> => {
    try {
      const response = await axios.get<OrderHistory[]>(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/order/getByEmail/${email}`,
        {headers: {
            Authorization: token
          }}
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  };