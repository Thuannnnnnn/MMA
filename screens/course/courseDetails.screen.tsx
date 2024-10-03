import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import img from '@/assets/Course/BgCourseDetail.png';
import { Course } from '@/constants/Course/CourseDetails';
import { getCourseById } from '@/API/Course/CourseDetailsAPI';
const { width, height } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  getAllCartByEmail } from '@/API/Cart/cartAPI';
import {  useRouter } from 'expo-router';

export default function CourseDetailsScreen() {
  const courseId = 't_introduction_to_programming';
  const [course, setCourse] = useState<Course | null>(null);
  

  // Function to handle HTML rendering, with text styles.
  const renderHTMLText = (htmlString: string) => {
    const parts = htmlString.split(/(<strong>|<\/strong>|<p>|<\/p>|<i>|<\/i>)/g);

    return parts.map((part, index) => {
      if (part === '<p>' || part === '</p>' || part === '<i>' || part === '</i>' || part === '<strong>' || part === '</strong>') {
        return null;
      }
      const isBold = parts[index - 1] === '<strong>';
      return (
        <Text key={index} style={isBold ? styles.boldText : styles.regularText}>
          {part}
        </Text>
      );
    });
  };

  // Fetching course details using AsyncStorage and API call.
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const fetchedCourse = await getCourseById(courseId, token);
          setCourse(fetchedCourse);
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Function to handle adding course to cart
 const handleAddToCart = async (_id: string) => {
  const router = useRouter(); // Initialize router
  console.log('Trying to add course to cart with ID:', _id);

  try {
    const token = await AsyncStorage.getItem('token'); // Get token from AsyncStorage
    let cartId = await AsyncStorage.getItem('cartId'); // Get cartId from AsyncStorage

    console.log('Token:', token);
    console.log('Cart ID from AsyncStorage:', cartId);

    if (token) {
      // If cartId is not available, fetch it from the API
      if (!cartId) {
        console.log('No cartId found, fetching from API...');
        const cartResponse = await getAllCartByEmail(token); // Adjust to use the correct function
        cartId = cartResponse.cartId; // Save cartId from API
        await AsyncStorage.setItem('cartId', cartId); // Save cartId in AsyncStorage
      }

      // Call API to add course to cart
      const response = await handleAddToCart(token, _id, cartId);
      console.log('Successfully added course to cart:', response);
      router.push('/(routes)/cart'); // Redirect to cart
    } else {
      console.warn('Token is null, unable to add course to cart.');
    }
  } catch (error) {
    console.error('Error adding course to cart:', error);
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
            <Text style={styles.aboutDescription}>{renderHTMLText(course.description)}</Text>
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
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerChildren}>
          <TouchableOpacity style={styles.favoriteButton} onPress={() => handleAddToCart(course._id)}>
            <Text style={styles.favoriteIcon}>Add to cart</Text>
          </TouchableOpacity>
        </View>

        {/* Nút Buy Now */}
        <View style={styles.footerChildren}>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#FFE7EE',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  childrent: {
    borderTopRightRadius: width * 0.04,
    borderTopLeftRadius: width * 0.04,
    padding: width * 0.05,
    backgroundColor: '#fff',
    flex: 1,
  },
  banner: {
    paddingTop: height * 0.01,
    width: width,
    height: height * 0.36,
    paddingHorizontal: width * 0.05,
  },
  label: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    top: height * 0.1,
  },
  labelText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: width * 0.025,
  },
  courseTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginVertical: 10,
    top: height * 0.1,
  },
  courseTitleChild: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  courseSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courseImage: {
    width: width * 0.3,
    height: height * 0.3,
    left: width * 0.65,
    bottom: height * 0.02,
  },
  price: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#3D5CFF',
    marginBottom: 10,
  },
  aboutCourse: {
    marginBottom: 20,
    zIndex: 1,
  },
  aboutTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  aboutDescription: {
    fontSize: width * 0.025,
    color: '#6c757d',
    marginTop: 10,
  },
  lessonList: {
    marginBottom: 20,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  lessonIndex: {
    fontSize: width * 0.08,
    fontWeight: 'light',
    marginRight: width * 0.05,
    color: '#cdcdcd',
  },
  lessonDetails: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  playButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#3D5CFF',
    borderRadius: 8,
  },
  playButtonText: {
    color: '#fff',
  },
  lockButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: width * 0.05,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerChildren: {
    width: '48%',
  },
  favoriteButton: {
    paddingVertical: 10,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButton: {
    paddingVertical: 10,
    backgroundColor: '#3D5CFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  favoriteIcon: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  boldText: {
    fontWeight: 'bold',
  },
  regularText: {
    fontWeight: 'normal',
  },
});
