import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { getCourseListByEmail } from "@/API/CourseList/courseListAPI";
import { CoursePurchase } from "@/constants/CourseList/courseList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const CourseListScreen = () => {
  const [coursePurchase, setCoursePurchase] = useState<CoursePurchase | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCourseList = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if(userString){
          const user = JSON.parse(userString);
          const userEmail = user.email;
          const token = `Bearer ${await AsyncStorage.getItem("token")}`;
          if(userEmail){
            const courses = await getCourseListByEmail(userEmail, token);
            setCoursePurchase(courses);
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

  const GotoContent =async (courseId: string) => {
    await AsyncStorage.setItem('courseIdGotoContent', courseId)
    router.push('/(routes)/content/content-list')
  }

  return (
    <View style={styles.container}>
      <FlatList
  data={coursePurchase?.courses ?? []} 
  keyExtractor={(item) => item?._id ?? Math.random().toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => {
        if (item?.courseId?._id) {
          GotoContent(item.courseId.courseId);
        }
      }}
    >
      {/* Course Poster */}
      <Image
        source={{
          uri:
            item?.courseId?.posterLink ??
            "https://example.com/default-course-image.png", // Fallback to default image URL
        }}
        style={styles.posterImage}
      />

      {/* Course Info */}
      <View style={styles.courseInfo}>
        <Text style={styles.courseName}>
          {item?.courseId?.courseName ?? "Unknown Course"} {/* Fallback to 'Unknown Course' */}
        </Text>
        <Text style={styles.roleText}>
          {coursePurchase?.userEmail ?? "Unknown Role"} {/* Fallback to 'Unknown Role' */}
        </Text>

        {/* Purchase Date */}
        <Text style={styles.purchaseDate}>
          Purchase Date:{" "}
          {item?.purchaseDate
            ? new Date(item.purchaseDate).toLocaleDateString()
            : "Unknown Date"} {/* Fallback for missing date */}
        </Text>

        {/* Paid Badge */}
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
    backgroundColor: "#fafafa", // Softer background for a cleaner look
  },
  courseCard: {
    flexDirection: "row",
    padding: 16,
    marginVertical: 10,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  posterImage: {
    flex: 1,
    width: 0,
    aspectRatio: 1,
    borderRadius: 10,
    marginRight: 16,
    backgroundColor: "#e0e0e0", // Placeholder background for missing images
  },
  courseInfo: {
    flex: 2,
    flexDirection: "column",
  },
  courseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    color: "#888",
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
