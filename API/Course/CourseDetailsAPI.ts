import axios from 'axios';

import { Course } from '@/constants/Course/CourseDetails';


export const getCourseById = async (courseId: string, token: string): Promise<Course | null> => {
  try {
    
    
    const response = await axios.get<{ course: Course }>(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/course/getById/${courseId}`, {
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

export const checkCourseOwnership = async (courseId: string, email: string, token: string) => {
  try {
    // Construct the URL for the API request
    const response = await axios.get(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/coursePurchased/checkCourseOwnership/${email}/${courseId}`, {
      headers: { Authorization: token },
    });

    return response.data.ownsCourse; // Ensure the API response has this property
  } catch (error) {
    console.error('Failed to check course ownership:', error);
    return false; // Return false if there's an error
  }
};
export const getCourseNameById = async (courseId: string, token: string): Promise<string | null> => {
  try {
    const course = await getCourseById(courseId, token);
    return course ? course.courseName : null; // Return courseName or null if the course is not found
  } catch (error) {
    console.error('Error fetching course name:', error);
    return null; // Return null if there's an error
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
