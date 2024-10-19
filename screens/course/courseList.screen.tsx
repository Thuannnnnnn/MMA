import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Animated,
  StatusBar,
} from "react-native";
import { getCourseListByEmail } from "@/API/CourseList/courseListAPI";
import { CoursePurchase } from "@/constants/CourseList/courseList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Process } from "@/constants/process/process";
import { getProcessByEmail } from "@/API/process/procesAPI";

const CourseListScreen = () => {
  const [coursePurchase, setCoursePurchase] = useState<CoursePurchase | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);

  // Helper function to create a new Animated.Value for each course
  const initializeAnimatedValues = (coursesLength: number) => {
    return Array.from({ length: coursesLength }, () => new Animated.Value(0));
  };

  useEffect(() => {
    const fetchCourseList = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          const userEmail = user.email;
          const token = `Bearer ${await AsyncStorage.getItem("token")}`;
          if (userEmail && token) {
            const courses = await getCourseListByEmail(userEmail, token);
            if (courses && courses.courses) {
              setCoursePurchase(courses);

              // Initialize animated values for each course
              setAnimatedValues(
                initializeAnimatedValues(courses.courses.length)
              );
            }
          }
        }
      } catch (err) {
        setError(`Failed to fetch course list: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseList();
  }, []);

  useEffect(() => {
    const fetchDataProcess = async () => {
      try {
        const token = `Bearer ${await AsyncStorage.getItem("token")}`;
        const userString = await AsyncStorage.getItem("user");
        let user;
        if (userString) {
          user = JSON.parse(userString);
        }
        if (token && user) {
          const result: Process[] = await getProcessByEmail(user.email, token);
          if (coursePurchase && result) {
            // Kiểm tra xem animatedValues có đủ kích thước không
            if (animatedValues.length === coursePurchase.courses.length) {
              coursePurchase.courses.forEach((course, index) => {
                if (course.courseId) {
                  const tasksForCourse = result
                    .filter((item) => item.courseId === course.courseId?._id)
                    .flatMap((item) => item.content);

                  const completedTasks = tasksForCourse.filter(
                    (task) => task.isComplete === true
                  ).length;
                  const totalTasks = tasksForCourse.length;
                  const progress =
                    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                  // Cập nhật thanh tiến trình
                  Animated.timing(animatedValues[index], {
                    toValue: progress,
                    duration: 500,
                    useNativeDriver: false,
                  }).start();
                }
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching process data:", error);
      }
    };

    if (coursePurchase) {
      fetchDataProcess();
    }
  }, [coursePurchase, animatedValues]);


  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!coursePurchase || coursePurchase.courses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No courses found.</Text>
      </View>
    );
  }

  const GotoContent = async (courseId: string, course_id: string) => {
    await AsyncStorage.setItem("course_id", course_id);
    await AsyncStorage.setItem("courseIdGotoContent", courseId);
    router.push("/(routes)/content/content-list");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={coursePurchase?.courses ?? []}
        keyExtractor={(item) => item?._id ?? Math.random().toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => {
              if (item?.courseId?.courseId) {
                GotoContent(item.courseId.courseId, item.courseId._id);
              }
            }}
          >
            <Image
              source={{
                uri:
                  item?.courseId?.posterLink ??
                  "https://example.com/default-course-image.png",
              }}
              style={styles.posterImage}
            />
            <View style={styles.courseInfo}>
              <Text style={styles.courseName}>
                {item?.courseId?.courseName ?? "Unknown Course"}
              </Text>
              <Text style={styles.roleText}>
                {coursePurchase?.userEmail ?? "Unknown Role"}
              </Text>
              <Text style={styles.purchaseDate}>
                Purchase Date:{" "}
                {item?.purchaseDate
                  ? new Date(item.purchaseDate).toLocaleDateString()
                  : "Unknown Date"}
              </Text>
              <View style={styles.progressContainerMain}>
                <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
                <View style={styles.progressContainer}>
                  <Animated.View
                    style={{
                      height: 20,
                      width: animatedValues[index]?.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["0%", "100%"],
                      }),
                      backgroundColor: "#76c7c0",
                    }}
                  />
                </View>
              </View>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>Paid</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CourseListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fafafa",
  },
  courseCard: {
    flexDirection: "row",
    padding: 16,
    marginVertical: 10,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
    
  },
  progressContainerMain: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingBottom: 10,
  },
  progressContainer: {
    height: 20,
    width: "100%",
    backgroundColor: "#e0e0df",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 8,
  },
  progress: {

    height: "100%",
    backgroundColor: "#76c7c0", // Màu xanh nhẹ cho thanh tiến trình
    borderRadius: 5, // Thêm border radius cho thanh tiến trình
  },
  posterImage: {
    flex: 1,
    width: 0,
    aspectRatio: 1,
    borderRadius: 10,
    marginRight: 16,
    backgroundColor: "#e0e0e0",
  },
  courseInfo: {
    flex: 2,
    flexDirection: "column",
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold", // Đổi font-weight thành bold
    color: "#333",
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    color: "#666", // Sử dụng màu xám tối cho văn bản
    marginBottom: 8,
  },
  purchaseDate: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 8,
  },
  paidBadge: {
    backgroundColor: "#4caf50",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  paidText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
});
