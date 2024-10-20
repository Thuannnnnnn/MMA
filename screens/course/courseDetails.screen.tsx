import React, { useCallback, useEffect, useState } from "react";
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
  replyToFeedback,
  deleteFeedbackReply,
} from "@/API/Feedback/feedbackAPI";

import {
  getCourseById,
  checkCourseOwnership,
} from "@/API/Course/CourseDetailsAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllCartByEmail, addToCart } from "@/API/Cart/cartAPI";
import { useRouter } from "expo-router";
import { ResizeMode, Video } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";

import { getAverageRatingForCourse, createRating, getRatingsCountByType, hasUserProvidedFeedbackAndRating, getRatingByUserEmail, updateRating    } from '@/API/Rating/ratingAPI';
import { AirbnbRating } from 'react-native-ratings';
import { Rating } from "@/constants/Rating/Rating";

const { width, height } = Dimensions.get("window");

export default function CourseDetailsScreen() {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [newFeedbackText, setNewFeedbackText] = useState<string>("");
  const [newReplyText, setNewReplyText] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [shouldPlay, setShouldPlay] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setShouldPlay(true);

      return () => {
        setShouldPlay(false);
      };
    }, [])
  );

  const [hasRated, setHasRated] = useState<boolean>(false);
  const [averageRating, setAverageRating] = useState<string | null>(null);
  const [starCount, setStarCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isRatingSubmitted, setIsRatingSubmitted] = useState<boolean>(false);
  const [previousRating, setPreviousRating] = useState<Rating | null>(null);
  const [ratingsCount, setRatingsCount] = useState<number[]>([0, 0, 0, 0, 0]);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [token, setToken] = useState<string | null>(null);

 

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
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

  const handleReplyToFeedback = async (feedbackId: string) => {
    if (!newReplyText.trim()) {
      Alert.alert("Error", "Please enter your reply before submitting.");
      return;
    }

    try {
      const token = `Bearer ${await AsyncStorage.getItem("token")}`;
      const userEmail = JSON.parse(
        (await AsyncStorage.getItem("user")) || "{}"
      ).email;

      await replyToFeedback(feedbackId, newReplyText, userEmail, token);

      const updatedFeedbacks = await getFeedbackByCourseId(
        courseId as string,
        token
      );

      const sortedFeedbacks = updatedFeedbacks.sort(
        (a, b) =>
          new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
      );

      setFeedbacks(sortedFeedbacks);

      setNewReplyText("");
      setReplyingTo(null);
    } catch (error) {
      Alert.alert("Error", "There was an error submitting your reply.");
      console.error("Error submitting reply:", error);
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this feedback?",
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
              setFeedbacks(
                updatedFeedbacks.sort(
                  (a, b) =>
                    new Date(b.createDate).getTime() -
                    new Date(a.createDate).getTime()
                )
              );
            } catch (error) {
              console.error("Error deleting feedback:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteReply = async (feedbackId: string, replyId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this reply?",
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
              await deleteFeedbackReply(feedbackId, replyId, token);

              const updatedFeedbacks = await getFeedbackByCourseId(
                courseId as string,
                token
              );

              setFeedbacks(
                updatedFeedbacks.sort(
                  (a, b) =>
                    new Date(b.createDate).getTime() -
                    new Date(a.createDate).getTime()
                )
              );
            } catch (error) {
              console.error("Error deleting reply:", error);
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
          setCourseId(storedCourseId);
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
          
          const fetchedFeedbacks = await getFeedbackByCourseId(courseId, token);
          const sortedFeedbacks = fetchedFeedbacks.sort(
            (a, b) =>
              new Date(b.createDate).getTime() -
            new Date(a.createDate).getTime()
          );
          setFeedbacks(sortedFeedbacks);
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

      const updatedFeedbacks = await getFeedbackByCourseId(
        courseId as string,
        token
      );
      const sortedFeedbacks = updatedFeedbacks.sort(
        (a, b) =>
          new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
      );
      setFeedbacks(sortedFeedbacks);

      setNewFeedbackText("");
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

  useEffect(() => {
    const fetchTokenAndCourseId = async () => {
      try {
        const values = await AsyncStorage.multiGet(["token", "courseId_detail"]);
        const fetchedToken = values[0][1];
        const fetchedCourseId = values[1][1];

        setToken(fetchedToken);
        setCourseId(fetchedCourseId);
      } catch (error) {
        console.error("Error fetching token and course ID:", error);
      }
    };

    fetchTokenAndCourseId();
  }, []);

  useEffect(() => {
    const fetchCourseAndRelatedData = async (token: string, courseId: string) => {
      try {
        const authToken = `Bearer ${token}`;
        // Gọi tất cả các API liên quan trong cùng một lầ
        const [fetchedCourse, avgRating, ratingsResponse] = await Promise.all([
          getCourseById(courseId, authToken),
          getAverageRatingForCourse(courseId, authToken),
          getRatingsCountByType(courseId, authToken),
        ]);

        setCourse(fetchedCourse); // Cập nhật thông tin khóa học

        setAverageRating(avgRating ? avgRating.toString() : "0");

        
        const ratingCounts = [
          ratingsResponse[5] || 0,
          ratingsResponse[4] || 0,
          ratingsResponse[3] || 0,
          ratingsResponse[2] || 0,
          ratingsResponse[1] || 0,
        ];
        setRatingsCount(ratingCounts);
        
      const total = ratingCounts.reduce((acc, count) => acc + count, 0);
      setTotalRatings(total);
      } catch (error) {
        console.error("Failed to fetch course or rating:", error);
      }
    };

    if (token && courseId) {
      fetchCourseAndRelatedData(token, courseId);
    }
  }, [token, courseId]);

  
  useEffect(() => {
    const fetchAverageRating = async (token: string, courseId: string) => {
      try {
        const authToken = `Bearer ${token}`;
        const avgRating = await getAverageRatingForCourse(courseId, authToken);
        if (avgRating !== null) {
          setAverageRating(avgRating.toString()); // Cập nhật state cho averageRating
        }
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };
  
    
    if (token && courseId) {
      fetchAverageRating(token, courseId);
    }
  }, [token, courseId]);

  
  const handleSubmitRating = async () => {
    try {
      if (starCount === 0) {
        Alert.alert("Error", "Please select a star rating before submitting.");
        return;
      }
      const token = `Bearer ${await AsyncStorage.getItem("token")}`;
      const userEmail = JSON.parse((await AsyncStorage.getItem("user")) || "{}").email;
      
      if (course) {
        if (courseId) {
          await createRating(userEmail, starCount, courseId, feedback, token);
        } else {
          Alert.alert("Error", "Course ID is not available.");
        }
      } else {
        Alert.alert("Error", "Course information is not available.");
      }
      setIsRatingSubmitted(true);
      Alert.alert("Success", "You have successfully submitted your rating!");
    } catch (error) {
      Alert.alert("Error", "Your rating could not be submitted.");
      console.error("Error submitting rating:", error);
    }
};

useEffect(() => {
  const checkIfUserRated = async () => {
    if (currentUserEmail && courseId && token) {
      const token = `Bearer ${await AsyncStorage.getItem("token")}`;
      const result = await hasUserProvidedFeedbackAndRating(currentUserEmail, courseId, token);
      setHasRated(result || false); // Cập nhật trạng thái hasRated
    }
  };

  if (token && courseId && currentUserEmail) {
    checkIfUserRated();
  }
}, [token, courseId, currentUserEmail]);


const shouldShowRatingForm = isOwner && !hasRated;
const shouldShowUpdateRatingForm = isOwner && hasRated;

useEffect(() => {
  const fetchPreviousRating = async () => {
    try {
      const token = `Bearer ${await AsyncStorage.getItem("token")}`;
      const userEmail = JSON.parse((await AsyncStorage.getItem("user")) || "{}").email;

      if (!userEmail || !courseId) {
        return;
      }

     
      const ratings = await getRatingByUserEmail(userEmail, token);

      
      const userRating = ratings?.find(rating => rating.courseId === courseId);

      if (userRating) {
        setPreviousRating(userRating);
        setStarCount(userRating.ratingPoint);
        setFeedback(userRating.feedback);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to load your previous rating.");
      console.error("Error fetching previous rating:", error);
    }
  };

  if (token && courseId) {
    fetchPreviousRating();
  }
}, [token, courseId]);


const handleUpdateRating = async () => {
  try {
    if (starCount === 0) {
      Alert.alert("Error", "Please select a star rating before updating.");
      return;
    }

    const token = `Bearer ${await AsyncStorage.getItem("token")}`;
    const ratingId = previousRating?._id;

    if (ratingId) {
      await updateRating(ratingId, starCount, feedback, token);

      setIsRatingSubmitted(true);
      Alert.alert("Success", "Your rating has been successfully updated!");
    } else {
      Alert.alert("Error", "Unable to find the rating ID for update.");
    }
  } catch (error) {
    Alert.alert("Error", "Your rating could not be updated.");
    console.error("Error updating rating:", error);
  }
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
            shouldPlay={shouldPlay}
          />
        </View>

        <View style={styles.childrent}>
          <View style={styles.aboutCourse}>
            <Text style={styles.courseTitleChild}>{course.courseName}</Text>
            <Text style={styles.price}>{course.price}VNĐ</Text>

            <Text style={styles.aboutTitle}>About this course</Text>
            <Text style={styles.aboutDescription}>
              {renderHTMLText(course.description)}
            </Text>
          </View>

          <View style={styles.averageRatingContainer}>
  {averageRating === null || averageRating === "0" ? (
    
    <Text style={styles.noRatingText}>There are no rating for this course yet!</Text>
  ) : (
    
    <>
      <Text style={styles.averageRatingText}>{averageRating}</Text>
      <AirbnbRating
        isDisabled
        defaultRating={parseFloat(averageRating)}
        showRating={false}
        size={20}
        starContainerStyle={styles.starsContainer}
      />
    </>
  )}
</View>

      {/* Rating Bars */}
      <View style={styles.ratingBarsContainer}>
        {[5, 4, 3, 2, 1].map((rating, index) => (
          <View key={rating} style={styles.ratingRow}>
            <Text style={styles.ratingNumber}>{rating}</Text>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: totalRatings === 0 ? '0%' : `${(ratingsCount[index] / totalRatings) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>


 {shouldShowRatingForm && (
          <View style={styles.ratingFormContainer}>
            <Text style={styles.ratingPrompt}>Please rate the course</Text>
            
            
            <AirbnbRating
              defaultRating={starCount} 
              onFinishRating={setStarCount}
              size={30}
            />

            
            <TextInput
              style={styles.feedbackInput}
              placeholder="Enter your rating..."
              value={feedback}
              onChangeText={setFeedback}
              multiline
            />

            
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitRating}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}

        
      {shouldShowUpdateRatingForm && previousRating && (
        <View style={styles.ratingFormContainer}>
          <Text style={styles.ratingPrompt}>Update your rating for the course</Text>
          <AirbnbRating
            defaultRating={starCount}
            onFinishRating={setStarCount}
            size={30}
          />
          <TextInput
            style={styles.feedbackInput}
            placeholder="Update your rating..."
            value={feedback}
            onChangeText={setFeedback}
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleUpdateRating}>
            <Text style={styles.submitButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      )}

          {/* Add Feedback Section */}
          <View style={styles.addFeedbackSection}>
            <Text style={styles.addFeedbackHeader}>Add Your Q&A</Text>

            {/* Feedback Text Input */}
            <TextInput
              style={styles.feedbackInput}
              placeholder="Write your Q&A..."
              value={newFeedbackText}
              onChangeText={setNewFeedbackText}
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitFeedback}
            >
              <Text style={styles.submitButtonText}>Submit Q&A</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackHeader}>Q&A</Text>
            {feedbacks.length > 0 ? (
              <>
                <View>
                  {feedbacks.map((feedback) => (
                    <View key={feedback._id} style={styles.feedbackItem}>
                      <View style={styles.feedbackHeaderRow}>
                        <Text style={styles.userEmail}>
                          {feedback.userEmail}
                        </Text>
                        {currentUserEmail === feedback.userEmail && (
                          <View style={styles.feedbackButtons}>
                            <TouchableOpacity
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

                      {feedback.replies && feedback.replies.length > 0 && (
                        <View style={styles.repliesSection}>
                          {/* Display the number of replies */}
                          {/* <Text style={styles.replyCount}>
                            {`${feedback.replies.length} replies`}
                          </Text> */}

                          {/* Toggle button to show/hide replies */}
                          <TouchableOpacity
                            onPress={() =>
                              setReplyingTo(
                                replyingTo === feedback._id
                                  ? null
                                  : feedback._id
                              )
                            } // Toggle visibility of replies
                          >
                            <Text style={styles.replyToggleButton}>
                              {replyingTo === feedback._id
                                ? "Hide replies"
                                : "Show replies"}
                            </Text>
                          </TouchableOpacity>

                          {/* Show replies only if the 'replyingTo' matches the feedback's ID */}
                          {replyingTo === feedback._id &&
                            feedback.replies.map((reply, index) => (
                              <View key={index} style={styles.replyItem}>
                                {/* Row for replied text and delete button */}
                                <View style={styles.replyRow}>
                                  <Text style={styles.replyUser}>
                                    {reply.repliedBy} replied:
                                  </Text>
                                  {currentUserEmail === reply.repliedBy && (
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleDeleteReply(
                                          feedback._id,
                                          reply.replyId
                                        )
                                      }
                                    >
                                      <Text style={styles.deleteButtonText}>
                                        Delete
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                </View>
                                <Text>{reply.replyText}</Text>
                              </View>
                            ))}
                        </View>
                      )}

                      {/* Form nhập reply */}
                      {replyingTo === feedback._id ? (
                        <View>
                          <TextInput
                            style={styles.replyInput}
                            placeholder="Write your reply..."
                            value={newReplyText}
                            onChangeText={setNewReplyText}
                          />
                          <TouchableOpacity
                            onPress={() => handleReplyToFeedback(feedback._id)}
                          >
                            <Text style={styles.replyButtonText}>
                              Submit Reply
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => setReplyingTo(feedback._id)}
                        >
                          <Text style={styles.replyButtonText}>Reply</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text>No Q&A available for this course.</Text>
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

  disabled: {
    color: "#ccc", // Gray color for disabled buttons
  },
  addFeedbackSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    elevation: 2, // Add some shadow effect for iOS
  },
  addFeedbackHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  feedbackInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    height: 120,
    marginBottom: 15,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#28a745",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#f0f2f5",
    borderRadius: 10,
    elevation: 1,
  },
  feedbackHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 15,
  },
  // Feedback item container
  feedbackItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },

  // Header row containing user email and date
  feedbackHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // User email text
  userEmail: {
    fontSize: 16,
    fontWeight: "bold", // Make feedback strong
    color: "#555",
  },

  // Feedback text itself
  feedbackText: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
    color: "#666",
  },

  // Date styling
  date: {
    fontSize: 12,
    color: "#999",
  },

  // Container for buttons (Reply, Delete)
  feedbackButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
  },

  // Delete button text (small, not a full button)
  deleteButtonText: {
    color: "#dc3545",
    fontSize: 14,
    marginLeft: 15, // Small margin to separate from reply
  },

  // Reply button styled similarly to Delete but with blue color
  replyButtonText: {
    color: "#007bff",
    fontSize: 14,
  },

  // Reply section for nested replies
  repliesSection: {
    marginTop: 15,
    paddingLeft: 15,
  },

  // Individual reply item
  replyItem: {
    padding: 10,
    backgroundColor: "#f1f3f5",
    marginTop: 10,
    borderRadius: 8,
  },

  // Username in reply
  replyUser: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  // Reply input box for adding new replies
  replyInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: "#fff",
  },

  // Toggle replies button (small and blue)
  replyToggleButton: {
    color: "#007bff",
    marginTop: 5,
  },
  replyRow: {
    flexDirection: "row",       // Align items horizontally
    justifyContent: "space-between", // Spread items apart
    alignItems: "center",       // Center them vertically
  },
  

  // Reply count text
  replyCount: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
    fontWeight: "bold", // Make reply count stand out
  },
  
  ratingPrompt: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  submitRatingButton: {
    marginTop: 10,
    paddingVertical: 12,
    backgroundColor: "#28a745",
    borderRadius: 8,
    alignItems: "center",
  },

  ratingSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    elevation: 2,
  },
  
  averageAndBarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  totalRatingsText: {
    fontSize: 16,
    color: "#999",
    marginTop: 5,
  },

  ratingBars: {
    flex: 1,
  },

  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  ratingCountText: {
    width: 40,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },

  ratingFillContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    height: 20,
    marginHorizontal: 10,
  },

  ratingFill: {
    backgroundColor: '#FFD700',
    height: '100%',
    borderRadius: 5,
  },

  ratingNumberText: {
    width: 50,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },

  averageRatingContainer: {
    alignItems: "center",
    marginRight: 20,
  },
  averageRatingText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
  },
  starsContainer: {
    marginTop: 5,
  },
  ratingBarsContainer: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingNumber: {
    width: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  barBackground: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    height: 20,
    marginLeft: 10,
  },
  barFill: {
    backgroundColor: "#FFD700",
    height: "100%",
    borderRadius: 5,
  },
  ratingFormContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    elevation: 2, // Đổ bóng nhẹ
  },
  noRatingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#999", // Màu xám nhạt để nổi bật
    textAlign: "center",
    marginTop: 10,
  },
  
});
