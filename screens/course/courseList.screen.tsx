// CourseListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getCourseListByEmail } from '@/API/CourseList/courseListAPI';
import { CoursePurchase } from '@/constants/CourseList/courseList';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CourseListScreen = () => {
  const [coursePurchase, setCoursePurchase] = useState<CoursePurchase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userEmail = 'tranquocthuan2003@gmail.com';

  useEffect(() => {
    const fetchCourseList = async () => {
      try {
        const token = `Bearer ${await AsyncStorage.getItem('token')}`;
        const courses = await getCourseListByEmail(userEmail, token);
        setCoursePurchase(courses);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Courses</Text>
      <FlatList
        data={coursePurchase.courses}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <Text style={styles.courseText}>Purchase ID: {coursePurchase.purchaseId}</Text>
            <Text style={styles.courseText}>User Email: {coursePurchase.userEmail}</Text>
            <Text>Purchase Date: {new Date(item.purchaseDate).toLocaleDateString()}</Text>
            {item.courseId ? (
              <>
                <Text>Course ID: {item.courseId._id}</Text>
                <Text>Course Name: {item.courseId.courseName}</Text>
                <Text>Description: {item.courseId.description}</Text>
              </>
            ) : (
              <Text>Course ID: Not available</Text>
            )}
          </View>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  courseItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  courseText: {
    fontSize: 16,
    marginBottom: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
