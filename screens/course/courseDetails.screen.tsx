import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import img from '@/assets/Course/BgCourseDetail.png';
import { Course } from '@/constants/Course/CourseDetails';
import { getCourseById, checkCourseOwnership } from '@/API/Course/CourseDetailsAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllCartByEmail, addToCart } from '@/API/Cart/cartAPI';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function CourseDetailsScreen() {
  const router = useRouter(); // Initialize router
  const courseId = 't_introduction_to_programming';
  const [course, setCourse] = useState<Course | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false); // State for course ownership
  const renderHTMLText = (htmlString: string) => {
    const parts = htmlString.split(/(<strong>|<\/strong>|<p>|<\/p>|<i>|<\/i>)/g);
    return parts.map((part, index) => {
      if (['<p>', '</p>', '<i>', '</i>', '<strong>', '</strong>'].includes(part)) {
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
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = `Bearer ${await AsyncStorage.getItem('token')}`;
        if (token) {
          const fetchedCourse = await getCourseById(courseId, token);
          setCourse(fetchedCourse);
        }
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          const courseId = course?._id;
          if (courseId) {
            const isCourseOwner = await checkCourseOwnership(courseId, user.email, token);
            setIsOwner(isCourseOwner);
          } else {
            console.error('Course ID is undefined');
            setIsOwner(false);
          }
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
      }
    };
  
    fetchCourse();
  }, [courseId]);

  const handleAddToCart = async (_id: string) => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        console.warn("No user found in AsyncStorage.");
        return;
      }
      const user = JSON.parse(userString);
      const email = user.email;
      const token = `Bearer ${await AsyncStorage.getItem('token')}`;

      if (token) {
        const cartResponse = await getAllCartByEmail(email, token);
        const cartId = cartResponse?.cartId;

        if (!cartId) {
          console.warn('No cartId found, unable to add course to cart.');
          return;
        }
        await addToCart(cartId, token, _id);
        router.push('/(routes)/cart');
      } else {
        console.warn('Token is null, unable to add course to cart.');
      }
    } catch (error) {
      console.error('Error adding course to cart:', error);
    }
  };
  
  const handleBuyNow = async(_id: string, amount: string) => {
    const courseObj = {
      courseId: _id,
      purchaseDate: new Date(),
    };
  
    await AsyncStorage.setItem('courseId', JSON.stringify([courseObj]));
    await AsyncStorage.setItem('totalPrice', amount);
    router.push('/(routes)/payment');
  };
  
  const handleGotoCourse= async(courseId :string) =>{
    console.log(`Go to ${courseId}`)
  }

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
    {!isOwner ? ( // Check if user is not the owner
      <TouchableOpacity style={styles.favoriteButton} onPress={() => handleAddToCart(course._id)}>
        <Text style={styles.favoriteIcon}>Add to cart</Text>
      </TouchableOpacity>
    ) : null}
  </View>

  {!isOwner ? (
    <View style={styles.footerChildren}>
      <TouchableOpacity style={styles.buyButton} onPress={() => handleBuyNow(course._id, course.price)}>
        <Text style={styles.buyButtonText}>Buy Now</Text>
      </TouchableOpacity>
    </View>
  ) : null}
</View>

{isOwner && (
  <View style={styles.footer}>
  <View style={styles.footerGotoCourse}>
    <TouchableOpacity style={styles.goToCourse} onPress={() => handleGotoCourse(courseId)}>
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
  footerGotoCourse: {   
    width: '100%',    
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
  goToCourse: {
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
