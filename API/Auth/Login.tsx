import { LoginResponse, LoginError } from "@/constants/Auth/login";
import axios from "axios";

export const handleLoginBase = async (
  email: string,
  password: string
): Promise<LoginResponse | null> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/auth/login/base`,
      {
        email,
        password,
      }
    );

    const { user, token } = response.data;
    console.log("User data:", user);
    console.log("Token:", token);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const loginError: LoginError = error.response.data;
      console.error(loginError.message);
    } else {
      console.error("An unexpected error occurred.");
    }
    return null;
  }
};
