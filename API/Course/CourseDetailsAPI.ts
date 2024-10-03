import axios from 'axios';

import { Course } from '@/constants/Course/CourseDetails';


export const getCourseById = async (courseId: string, token: string): Promise<Course | null> => {
  try {
    const response = await axios.get<{ course: Course }>(`http://192.168.101.11:8080/api/course/getById/${courseId}`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.data && response.data.course) {
      return response.data.course;
    } else {
      console.error('Course data is undefined or null');
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw new Error('Failed to get course by ID');
  }
};

// export const getCourseById = async (courseId: string): Promise<Course> => {
//     console.log(`Fetching course with ID: ${courseId}`);
//     try {
//       const response = await axios.get<{ course: Course }>(`http://10.66.221.168:8080/api/course/getById/${courseId}`);
//       console.log(`Received response: `, response.data);
//       return response.data.course;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error('Axios error:', error.response?.data || error.message);
//       } else {
//         console.error('Error:', error);
//       }
//       throw new Error('Failed to get course by ID');
//     }
//   };
