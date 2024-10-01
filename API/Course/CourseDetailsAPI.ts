import axios from 'axios';

import { Course } from '@/constants/Course/CourseDetails';


// Define a base URL for the API
const BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.101.11';

export const fetchCourses = async (): Promise<Course[]> => {
  const url = `${BASE_URL}/course/course/getAll`;

  try {
    const { data } = await axios.get<Course[]>(url);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error fetching courses: ${error.message}`);
    }
    throw error;
  }
};
