// API Client - fetch sorted courses
import axios from "axios";
import { Course } from "@/constants/HomePage/course";

const API_BASE_URL = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Fetch courses sorted by price descending
export const fetchCoursesByPriceDesc = async (token: string): Promise<Course[]> => {
  try {
    const response = await axios.get<Course[]>(`${API_BASE_URL}/api/course/getCoursesByPriceDesc`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching courses by price (desc):", error);
    throw error;
  }
};

// Fetch courses sorted by price ascending
export const fetchCoursesByPriceAsc = async (token: string): Promise<Course[]> => {
  try {
    const response = await axios.get<Course[]>(`${API_BASE_URL}/api/course/getCoursesByPriceAsc`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching courses by price (asc):", error);
    throw error;
  }
};

// Fetch courses sorted by rating descending
export const fetchCoursesByRatingDesc = async (token: string): Promise<Course[]> => {
  try {
    const response = await axios.get<Course[]>(`${API_BASE_URL}/api/course/getCoursesByRatingDesc`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching courses by rating (desc):", error);
    throw error;
  }
};
