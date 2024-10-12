import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import img from "@/assets/Course/BgCourseDetail.png";
import { Course } from "@/constants/Course/CourseDetails";
import { Feedback } from "@/constants/Feedback/Feedback"; // Import Feedback interface
import {
  getFeedbackByCourseId,
  createFeedback,
  deleteFeedback,
} from "@/API/Feedback/feedbackAPI"; // API for feedback
import {
  getCourseById,
  checkCourseOwnership,
} from "@/API/Course/CourseDetailsAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllCartByEmail, addToCart } from "@/API/Cart/cartAPI";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function CourseDetailsScreen() {
  const router = useRouter(); // Initialize router
  const [courseId, setCourseId] = useState<string | null>(null); // State for course ID
  const [course, setCourse] = useState<Course | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false); // State for course ownership
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]); // Update type to Feedback[]
  const [newFeedbackText, setNewFeedbackText] = useState<string>(""); // For new feedback text
  const [rating, setRating] = useState<number>(0);

  // Tính tổng và trung bình điểm đánh giá
  const calculateFeedbackStats = () => {
    if (feedbacks.length === 0) return { total: 0, average: 0 };
    const total = feedbacks.reduce(
      (acc, feedback) => acc + feedback.ratingPoint,
      0
    );
    const average = total / feedbacks.length;
    return { total, average };
  };

  const { average } = calculateFeedbackStats(); // Lấy dữ liệu tổng và trung bình

  // Function to render HTML text
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
    try {
      const token = `Bearer ${await AsyncStorage.getItem("token")}`;
      await deleteFeedback(feedbackId, token);

      // Update feedback list after deletion
      const updatedFeedbacks = await getFeedbackByCourseId(
        courseId as string,
        token
      );
      setFeedbacks(updatedFeedbacks);
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };
  // Fetch courseId from AsyncStorage
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

  // Fetch course and feedback data
  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        try {
          const token = `Bearer ${await AsyncStorage.getItem("token")}`;
          const fetchedCourse = await getCourseById(courseId, token);
          setCourse(fetchedCourse);

          // Fetch feedbacks for the course
          const fetchedFeedbacks = await getFeedbackByCourseId(courseId, token);
          setFeedbacks(fetchedFeedbacks); // Set feedback state

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
          console.error("Failed to fetch course or feedback:", error);
        }
      }
    };

    fetchCourse();
  }, [courseId]);

  // Handle feedback submission
  const handleSubmitFeedback = async () => {
    if (rating === 0 || newFeedbackText.trim() === "") {
      alert("Please provide both a rating and feedback.");
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
        rating,
        newFeedbackText,
        token
      );

      // Refresh feedback list after submission
      const updatedFeedbacks = await getFeedbackByCourseId(
        courseId as string,
        token
      );
      setFeedbacks(updatedFeedbacks);

      // Reset feedback input fields
      setRating(0);
      setNewFeedbackText("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  // Handle star rating selection
  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  // Function to round to nearest half star
  const roundToNearestHalf = (num: number) => {
    return Math.round(num * 2) / 2;
  };

  // Function to render stars based on average rating
  const renderStars = (average: number) => {
    const roundedAverage = roundToNearestHalf(average);
    const fullStars = Math.floor(roundedAverage);
    const halfStar = roundedAverage % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <View style={styles.starRating}>
        {/* Render full stars */}
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <FontAwesome
              key={`full-${index}`}
              name="star"
              size={30}
              color="#FFD700"
            />
          ))}

        {/* Render half star if needed */}
        {halfStar && <FontAwesome name="star-half" size={30} color="#FFD700" />}

        {/* Render empty stars */}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <FontAwesome
              key={`empty-${index}`}
              name="star-o"
              size={30}
              color="#FFD700"
            />
          ))}
      </View>
    );
  };

  if (!course) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  // Handle add to cart
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

  // Handle buy now
  const handleBuyNow = async (_id: string, amount: string) => {
    const courseObj = {
      courseId: _id,
      purchaseDate: new Date(),
    };

    await AsyncStorage.setItem("courseId", JSON.stringify([courseObj]));
    await AsyncStorage.setItem("totalPrice", amount);
    router.push("/(routes)/payment");
  };

  // Handle navigating to course content
  const handleGotoCourse = async (courseId: string) => {
    console.log(`Go to ${courseId}`);
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
          <View style={styles.label}>
            <Text style={styles.labelText}>BESTSELLER</Text>
          </View>
          <Text style={styles.courseTitle}>{course.courseName}</Text>
          <Image source={img} style={styles.courseImage} />
        </View>

        <View style={styles.childrent}>
          {/* About Course Section */}
          <View style={styles.aboutCourse}>
            <View style={styles.courseSection}>
              <Text style={styles.courseTitleChild}>{course.courseName}</Text>
              <Text style={styles.price}>{course.price}$</Text>
            </View>

            <Text style={styles.aboutTitle}>About this course</Text>
            <Text style={styles.aboutDescription}>
              {renderHTMLText(course.description)}
            </Text>
          </View>

          {/* Lessons List */}
          <View style={styles.lessonList}>
            <View style={styles.lessonItem}>
              <Text style={styles.lessonIndex}>01</Text>
              <View style={styles.lessonDetails}>
                <Text style={styles.lessonTitle}>Welcome to the Course</Text>
              </View>
              <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.lessonItem}>
              <Text style={styles.lessonIndex}>02</Text>
              <View style={styles.lessonDetails}>
                <Text style={styles.lessonTitle}>Process overview</Text>
              </View>
              <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.lessonItem}>
              <Text style={styles.lessonIndex}>03</Text>
              <View style={styles.lessonDetails}>
                <Text style={styles.lessonTitle}>Discovery</Text>
              </View>
              <TouchableOpacity style={styles.lockButton}>
                <Text style={styles.playButtonText}>Lock</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.feedbackStats}>
            <View style={styles.ratingRow}>
              <Text>Rating: </Text>
              {renderStars(average)}
            </View>
            <Text style={styles.totalReviews}>
              Total Reviews: {feedbacks.length}
            </Text>
          </View>

          {/* Add Feedback Section */}
          <View style={styles.addFeedbackSection}>
            <Text style={styles.addFeedbackHeader}>Add Your Feedback</Text>

            {/* 5-Star Rating */}
            <View style={styles.starRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleStarPress(star)}
                >
                  <FontAwesome
                    name={star <= rating ? "star" : "star-o"}
                    size={30}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>

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
                  {feedbacks.reverse().map((feedback) => (
                    <View key={feedback._id} style={styles.feedbackItem}>
                      <View style={styles.feedbackHeaderRow}>
                        <Text style={styles.userEmail}>
                          {feedback.userEmail}
                        </Text>
                        <Text style={styles.rating}>
                          Rating: {feedback.ratingPoint}/5
                        </Text>
                      </View>
                      <Text style={styles.feedbackText}>
                        {feedback.feedbackText}
                      </Text>
                      <Text style={styles.date}>
                        {new Date(feedback.createDate).toLocaleDateString()}
                      </Text>
                      <View style={styles.feedbackButtons}>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteFeedback(feedback._id)}
                        >
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text>No feedback available for this course.</Text>
            )}
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
              onPress={() => handleGotoCourse(course._id)}
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
    backgroundColor: "#FFE7EE",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center", // Aligns text and stars vertically
  },
  feedbackButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
  },
  feedbackStats: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
  },
  averageRating: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalReviews: {
    fontSize: 16,
    color: "#666",
  },
  feedbackSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
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
  rating: {
    color: "#ffcc00",
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
  starRating: {
    flexDirection: "row",
    justifyContent: "flex-start",
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
  childrent: {
    borderTopRightRadius: width * 0.04,
    borderTopLeftRadius: width * 0.04,
    padding: width * 0.05,
    backgroundColor: "#fff",
    flex: 1,
  },
  banner: {
    paddingTop: height * 0.01,
    width: width,
    height: height * 0.36,
    paddingHorizontal: width * 0.05,
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
  courseSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
});
