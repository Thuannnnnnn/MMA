// api.ts
import axios from 'axios';
import { Course } from '@/constants/HomePage/course';

export const fetchCourses = async (token:string): Promise<Course[]> => {
  try {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/course/getAll`,{
      headers: {
      Authorization: token
    },});
    return response.data.map((course: any) => ({
      courseId: course.courseId,
      courseName: course.courseName,
      description: course.description,
      posterLink: course.posterLink,
      createDate: course.createDate,
      videoIntro: course.videoIntro,
      userGenerated: course.userGenerated,
      price: course.price,
      category: course.category,
      contents: course.contents
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
    throw new Error('Failed to fetch courses');
  }
};
