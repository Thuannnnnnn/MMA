import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Course } from '@/constants/Course/CourseDetails';
import { getCourseById, checkCourseOwnership } from '@/API/Course/CourseDetailsAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllCartByEmail, addToCart } from '@/API/Cart/cartAPI';
import { useRouter } from 'expo-router';
import { ResizeMode, Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

export default function CourseDetailsScreen() {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false); 
  
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
    const fetchCourseId = async () => {
      try {
        const storedCourseId = await AsyncStorage.getItem('courseId_detail');
        if (storedCourseId) {
          setCourseId(storedCourseId); // Set the courseId state
        } else {
          console.error('No course ID found in AsyncStorage');       
        }
      } catch (error) {
        console.error('Failed to retrieve course ID:', error);
      }
    };
  
    fetchCourseId();
  }, []);
  
  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        try {
          const token = `Bearer ${await AsyncStorage.getItem('token')}`;
          const fetchedCourse = await getCourseById(courseId, token);
          setCourse(fetchedCourse);
          const userString = await AsyncStorage.getItem('user');
          if (userString) {
            const user = JSON.parse(userString);
            const courseIdOw = fetchedCourse?._id;
            if(courseIdOw){
              const isCourseOwner = await checkCourseOwnership(courseIdOw, user.email, token);
              setIsOwner(isCourseOwner);
            }
          }
        } catch (error) {
          console.error('Failed to fetch course:', error);
        }
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
  
  const GotoContent =async (courseId: string) => {
    await AsyncStorage.setItem('courseIdGotoContent', courseId)
    router.push('/(routes)/content/content-list')
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
            <Text style={styles.aboutDescription}>{renderHTMLText(course.description)}</Text>
          </View>
        

          
        </View>
      </ScrollView>
      <View style={styles.footer}>
  <View style={styles.footerChildren}>
    {!isOwner ? ( 
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
    <TouchableOpacity style={styles.goToCourse} onPress={() => GotoContent(course.courseId)}>
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
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    
  },
  childrent: {
    borderTopRightRadius: width * 0.04,
    borderTopLeftRadius: width * 0.04,
    padding: width * 0.05,
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: 'black'
  },
  banner: {
    paddingTop: height * 0.01,
    width: width,
    height: height * 0.36,
    paddingHorizontal: width * 0.05,
    position: 'relative',
  },
  video: {
    position: 'absolute',
    width: width,
    height: '100%',
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
