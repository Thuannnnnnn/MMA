import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import { Feedback } from "@/constants/Feedback/Feedback";
import { Course } from "@/constants/Course/CourseDetails";
import {
  getFeedbackByCourseId,
  createFeedback,
  deleteFeedback,
} from "@/API/Feedback/feedbackAPI";

import {
  getCourseById,
  checkCourseOwnership,
} from "@/API/Course/CourseDetailsAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllCartByEmail, addToCart } from "@/API/Cart/cartAPI";
import { useRouter } from "expo-router";
import { ResizeMode, Video } from "expo-av";

const { width, height } = Dimensions.get("window");

export default function CourseDetailsScreen() {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]); // Update type to Feedback[]
  const [newFeedbackText, setNewFeedbackText] = useState<string>(""); // For new feedback text
  // Add a state to store the logged-in user's email
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const itemsPerPage = 5; // Number of feedbacks per page

  // Calculate total number of pages
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  // Calculate the feedback to be displayed on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFeedbacks = feedbacks.slice(startIndex, endIndex);

  // Function to handle page navigation
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderHTMLText = (htmlString: string) => {
    const parts = htmlString.split(
      /(<strong>|<\/strong>|<p>|<\/p>|<i>|<\/i>)/g
    );
    return parts.map((part, index) => {
      if (
        ["<p>", "</p>", "<i>", "</i>", "<strong>", "</strong>"].includes(part)
      ) {
        return null;
      }
      const isBold = parts[index - 1] === "<strong>";
      return (
        <Text key={index} style={isBold ? styles.boldText : styles.regularText}>
          {part}
        </Text>
      );
    });
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    Alert.alert(
      "Confirm Delete", // Title of the alert
      "Are you sure you want to delete this feedback?", // Message of the alert
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete Cancelled"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const token = `Bearer ${await AsyncStorage.getItem("token")}`;
              await deleteFeedback(feedbackId, token);

              // Update feedback list after deletion
              const updatedFeedbacks = await getFeedbackByCourseId(
                courseId as string,
                token
              );
              // Sắp xếp lại feedback từ mới nhất đến cũ nhất
            setFeedbacks(updatedFeedbacks.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime()));
            } catch (error) {
              console.error("Error deleting feedback:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const fetchCourseId = async () => {
      try {
        const storedCourseId = await AsyncStorage.getItem("courseId_detail");
        if (storedCourseId) {
          setCourseId(storedCourseId); // Set the courseId state
        } else {
          console.error("No course ID found in AsyncStorage");
        }
      } catch (error) {
        console.error("Failed to retrieve course ID:", error);
      }
    };

    fetchCourseId();
  }, []);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setCurrentUserEmail(user.email);
        }
      } catch (error) {
        console.error("Failed to retrieve user email:", error);
      }
    };

    fetchUserEmail();
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        try {
          const token = `Bearer ${await AsyncStorage.getItem("token")}`;
          const fetchedCourse = await getCourseById(courseId, token);
          setCourse(fetchedCourse);

          // Fetch feedbacks for the course and sort them by createDate (newest first)
          const fetchedFeedbacks = await getFeedbackByCourseId(courseId, token);
          const sortedFeedbacks = fetchedFeedbacks.sort(
            (a, b) =>
              new Date(b.createDate).getTime() -
              new Date(a.createDate).getTime()
          );
          setFeedbacks(sortedFeedbacks); // Set sorted feedbacks state

          const userString = await AsyncStorage.getItem("user");
          if (userString) {
            const user = JSON.parse(userString);
            const courseIdOw = fetchedCourse?._id;
            if (courseIdOw) {
              const isCourseOwner = await checkCourseOwnership(
                courseIdOw,
                user.email,
                token
              );
              setIsOwner(isCourseOwner);
            }
          }
        } catch (error) {
          console.error("Failed to fetch course:", error);
        }
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleSubmitFeedback = async () => {
    if (!newFeedbackText.trim()) {
      Alert.alert("Error", "Please enter your feedback before submitting.");
      return;
    }

    try {
      const token = `Bearer ${await AsyncStorage.getItem("token")}`;
      const userEmail = JSON.parse(
        (await AsyncStorage.getItem("user")) || "{}"
      ).email;

      await createFeedback(
        courseId as string,
        userEmail,
        newFeedbackText,
        token
      );

      // Fetch updated feedbacks and sort them by createDate (newest first)
      const updatedFeedbacks = await getFeedbackByCourseId(
        courseId as string,
        token
      );
      const sortedFeedbacks = updatedFeedbacks.sort(
        (a, b) =>
          new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
      );
      setFeedbacks(sortedFeedbacks); // Update state with sorted feedbacks

      setNewFeedbackText(""); // Clear input after submission
    } catch (error) {
      Alert.alert("Error", "There was an error submitting your feedback.");
      console.error("Error submitting feedback:", error);
    }
  };

  const handleAddToCart = async (_id: string) => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        console.warn("No user found in AsyncStorage.");
        return;
      }
      const user = JSON.parse(userString);
      const email = user.email;
      const token = `Bearer ${await AsyncStorage.getItem("token")}`;

      if (token) {
        const cartResponse = await getAllCartByEmail(email, token);
        const cartId = cartResponse?.cartId;

        if (!cartId) {
          console.warn("No cartId found, unable to add course to cart.");
          return;
        }
        await addToCart(cartId, token, _id);
        router.push("/(routes)/cart");
      } else {
        console.warn("Token is null, unable to add course to cart.");
      }
    } catch (error) {
      console.error("Error adding course to cart:", error);
    }
  };

  const handleBuyNow = async (_id: string, amount: string) => {
    const courseObj = {
      courseId: _id,
      purchaseDate: new Date(),
    };

    await AsyncStorage.setItem("courseId", JSON.stringify([courseObj]));
    await AsyncStorage.setItem("totalPrice", amount);
    router.push("/(routes)/payment");
  };

  const GotoContent = async (courseId: string) => {
    await AsyncStorage.setItem("courseIdGotoContent", courseId);
    router.push("/(routes)/content/content-list");
  };

  if (!course) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.banner}>
          <Video
            source={{ uri: course.videoIntro }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay
          />
        </View>

        <View style={styles.childrent}>
          {/* About Course Section */}
          <View style={styles.aboutCourse}>
            <Text style={styles.courseTitleChild}>{course.courseName}</Text>
            <Text style={styles.price}>{course.price}VNĐ</Text>

            <Text style={styles.aboutTitle}>About this course</Text>
            <Text style={styles.aboutDescription}>
              {renderHTMLText(course.description)}
            </Text>
          </View>

          {/* Add Feedback Section */}
          <View style={styles.addFeedbackSection}>
            <Text style={styles.addFeedbackHeader}>Add Your Feedback</Text>

            {/* Feedback Text Input */}
            <TextInput
              style={styles.feedbackInput}
              placeholder="Write your feedback..."
              value={newFeedbackText}
              onChangeText={setNewFeedbackText}
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitFeedback}
            >
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackHeader}>Feedback</Text>
            {feedbacks.length > 0 ? (
              <>
                <View>
                  {[...currentFeedbacks].map((feedback) => (
                    <View key={feedback._id} style={styles.feedbackItem}>
                      <View style={styles.feedbackHeaderRow}>
                        <Text style={styles.userEmail}>
                          {feedback.userEmail}
                        </Text>
                        {currentUserEmail === feedback.userEmail && (
                          <View style={styles.feedbackButtons}>
                            <TouchableOpacity
                              style={styles.deleteButton}
                              onPress={() => handleDeleteFeedback(feedback._id)}
                            >
                              <Text style={styles.deleteButtonText}>
                                Delete
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                      <Text style={styles.feedbackText}>
                        {feedback.feedbackText}
                      </Text>
                      <Text style={styles.date}>
                        {new Date(feedback.createDate).toLocaleDateString()}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text>No feedback available for this course.</Text>
            )}
          </View>
          {/* Navigation Bar */}
          <View style={styles.pagination}>
            <TouchableOpacity
              onPress={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={[
                styles.pageButton,
                currentPage === 1 && styles.disabledButton,
              ]}
            >
              <Text style={styles.pageButtonText}>Previous</Text>
            </TouchableOpacity>

            <Text style={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </Text>

            <TouchableOpacity
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={[
                styles.pageButton,
                currentPage === totalPages && styles.disabledButton,
              ]}
            >
              <Text style={styles.pageButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerChildren}>
          {!isOwner ? (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleAddToCart(course._id)}
            >
              <Text style={styles.favoriteIcon}>Add to cart</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {!isOwner ? (
          <View style={styles.footerChildren}>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => handleBuyNow(course._id, course.price)}
            >
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {isOwner && (
        <View style={styles.footer}>
          <View style={styles.footerGotoCourse}>
            <TouchableOpacity
              style={styles.goToCourse}
              onPress={() => GotoContent(course.courseId)}
            >
              <Text style={styles.buyButtonText}>Go to Course</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  childrent: {
    borderTopRightRadius: width * 0.04,
    borderTopLeftRadius: width * 0.04,
    padding: width * 0.05,
    backgroundColor: "#ffffff",
    marginHorizontal: 10,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: "black",
  },
  banner: {
    paddingTop: height * 0.01,
    width: width,
    height: height * 0.36,
    paddingHorizontal: width * 0.05,
    position: "relative",
  },
  video: {
    position: "absolute",
    width: width,
    height: "100%",
  },

  label: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    top: height * 0.1,
  },
  labelText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: width * 0.025,
  },
  courseTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginVertical: 10,
    top: height * 0.1,
  },
  courseTitleChild: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginVertical: 10,
  },
  courseImage: {
    width: width * 0.3,
    height: height * 0.3,
    left: width * 0.65,
    bottom: height * 0.02,
  },
  price: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#3D5CFF",
    marginBottom: 10,
  },
  aboutCourse: {
    marginBottom: 20,
    zIndex: 1,
  },
  aboutTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  aboutDescription: {
    fontSize: width * 0.025,
    color: "#6c757d",
    marginTop: 10,
  },
  lessonList: {
    marginBottom: 20,
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  lessonIndex: {
    fontSize: width * 0.08,
    fontWeight: "light",
    marginRight: width * 0.05,
    color: "#cdcdcd",
  },
  lessonDetails: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  playButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#3D5CFF",
    borderRadius: 8,
  },
  playButtonText: {
    color: "#fff",
  },
  lockButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: width * 0.05,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerChildren: {
    width: "48%",
  },
  footerGotoCourse: {
    width: "100%",
  },

  favoriteButton: {
    paddingVertical: 10,
    backgroundColor: "#FF0000",
    borderRadius: 8,
    alignItems: "center",
  },
  buyButton: {
    paddingVertical: 10,
    backgroundColor: "#3D5CFF",
    borderRadius: 8,
    alignItems: "center",
  },
  goToCourse: {
    paddingVertical: 10,
    backgroundColor: "#3D5CFF",
    borderRadius: 8,
    alignItems: "center",
  },
  favoriteIcon: {
    color: "#fff",
    fontSize: width * 0.035,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: width * 0.035,
  },
  boldText: {
    fontWeight: "bold",
  },
  regularText: {
    fontWeight: "normal",
  },
  addFeedbackSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  addFeedbackHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  feedbackInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 100,
    marginBottom: 10,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#3D5CFF",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  feedbackSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  paginationText: {
    fontSize: 16,
    color: "#3D5CFF",
  },
  disabled: {
    color: "#ccc", // Gray color for disabled buttons
  },
  feedbackHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between", // This will space them out
    alignItems: "center", // Align vertically centered
    marginBottom: 5, // Add some space below this row
  },
  feedbackHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  feedbackItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    // You can add other styles like borderColor, shadow etc. if needed
  },

  userEmail: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 14,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  feedbackButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteButton: {
    backgroundColor: "#0000",
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "gray",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  pageButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  pageButtonText: {
    color: "#fff",
  },
  pageInfo: {
    fontSize: 16,
  },
});
