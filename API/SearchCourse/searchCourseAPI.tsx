import axios from "axios";
import { Course } from "@/constants/Course/CourseDetails";

export const fetchSearchCourses = async (searchCourse: string, token: string): Promise<Course[]> => {
    try {
        const response = await axios.get<Course[]>(
            `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/search/searchCourse?query=${searchCourse}`,
            {
                headers: {
                    Authorization: token
                }
            }
        );
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
