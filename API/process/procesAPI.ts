import axios from "axios";

const BASE_URL = `${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/process`; // Thay thế với URL API của bạn

export const createProcessForUser = async (
  courseId: string,
  userEmail: string,
  token: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/create`,
      { courseId: courseId, userEmail: userEmail },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Error:", error);
    }
    throw new Error("Failed to create process for user");
  }
};

export const updateProcessContent = async (
  processId: string,
  contentId: string,
  isComplete: boolean,
  token: string
) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/update/${processId}`,
      { contentId, isComplete },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Error:", error);
    }
    throw new Error("Failed to update process content");
  }
};

export const getProcessByCourseIdAndEmail = async (
  courseId: string,
  email: string,
  token: string
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/course/${courseId}/email/${email}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
    } else {
      console.error("Error:", error);
    }
    throw new Error("Failed to get process by course ID and email");
  }
};

export const deleteProcess = async (processId: string, token: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${processId}`, {
      headers: {
        Authorization: token,
      },
    });

    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Error:", error);
    }
    throw new Error("Failed to delete process");
  }
};


export const getProcessByEmail = async (
  email: string,
  token: string
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/email/${email}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
    } else {
      console.error("Error:", error);
    }
    throw new Error("Failed to get process by course ID and email");
  }
};
