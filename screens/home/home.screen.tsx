import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, ActivityIndicator, FlatList, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AvatarPng from '@/assets/homePage/avatar.png';
import { fetchCourses } from '@/API/HomePage/homePageAPI';
import { Course } from '@/constants/HomePage/course';
import { SlideData } from '@/constants/HomePage/slideData';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const slides: SlideData[] = [
  { key: '1', title: 'Slide 1', text: 'Welcome to Slide 1', backgroundColor: '#f7e9e9' },
  { key: '2', title: 'Slide 2', text: 'Welcome to Slide 2', backgroundColor: '#e2f9e2' },
  { key: '3', title: 'Slide 3', text: 'Welcome to Slide 3', backgroundColor: '#e2e9f9' },
  { key: '4', title: 'Slide 4', text: 'Welcome to Slide 4', backgroundColor: '#3a62bf' },
  { key: '5', title: 'Slide 5', text: 'Welcome to Slide 5', backgroundColor: '#d63075' },
];

export default function HomeScreen() {
  const [query, setQuery] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const fetchedCourses = await fetchCourses();
        setCourses(fetchedCourses);
        setDisplayedCourses(fetchedCourses.slice(0, 4));
      } catch (error) {
        console.error(error)
        Alert.alert('Error', 'Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, 3000);

    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: currentSlideIndex * screenWidth * 0.7,
        animated: true,
      });
    }
  }, [currentSlideIndex]);

  const loadMoreCourses = () => {
    if (displayedCourses.length < courses.length) {
      setLoadingMore(true);
      const nextCourses = courses.slice(displayedCourses.length, displayedCourses.length + 4);
      setTimeout(() => {
        setDisplayedCourses((prev) => [...prev, ...nextCourses]);
        setLoadingMore(false);
      }, 1000);
    }
  };

  const renderCourse = ({ item }: { item: Course }) => (
    <View style={styles.courseCard}>
      <Image source={{ uri: item.posterLink }} style={styles.courseImage} />
      <View style={styles.courseDetails}>
        <Text style={styles.courseTitle}>{item.courseName}</Text>
        <Text style={styles.coursePrice}>Price: {item.price}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#ffffff', '#e2e9f9', '#d7e2fb']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Home Page</Text>
            <Image style={styles.avatar} source={AvatarPng} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Find Course"
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <View style={styles.sliderContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
            >
              {slides.map(slide => (
                <View key={slide.key} style={[styles.slide, { backgroundColor: slide.backgroundColor }]}>
                  <Text style={styles.slideText}>{slide.text}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={displayedCourses}
              renderItem={renderCourse}
              keyExtractor={(item) => item.courseId}
              onEndReached={loadMoreCourses}
              onEndReachedThreshold={0.5} 
              ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#0000ff" /> : null}
            />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 20,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    marginHorizontal: screenWidth * 0.04,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: screenHeight * 0.02,
  },
  title: {
    fontSize: screenWidth * 0.08,
    fontWeight: 'bold',
  },
  avatar: {
    width: screenWidth * 0.1,
    height: screenHeight * 0.08,
    borderRadius: screenWidth * 0.02,
  },
  inputContainer: {
    marginVertical: screenHeight * 0.02,
    borderRadius: screenWidth * 0.02,
    backgroundColor: 'white',
  },
  input: {
    height: screenHeight * 0.06,
    paddingHorizontal: screenWidth * 0.03,
    fontSize: screenWidth * 0.04,
  },
  sliderContainer: {
    marginBottom: screenHeight * 0.02,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight * 0.25,
    width: screenWidth * 0.7,
    borderRadius: screenWidth * 0.02,
    padding: screenWidth * 0.05,
    marginRight: screenWidth * 0.02,
  },
  slideText: {
    fontSize: screenWidth * 0.05,
    fontWeight: 'bold',
  },
  courseCard: {
    flexDirection: 'row',
    marginBottom: screenHeight * 0.02,
    backgroundColor: '#fff',
    borderRadius: screenWidth * 0.02,
    overflow: 'hidden',
    elevation: 2,
  },
  courseImage: {
    width: screenWidth * 0.25,
    height: screenHeight * 0.12,
  },
  courseDetails: {
    flex: 1,
    padding: screenWidth * 0.03,
  },
  courseTitle: {
    fontSize: screenWidth * 0.05,
    fontWeight: 'bold',
  },
  coursePrice: {
    fontSize: screenWidth * 0.04,
    color: '#000',
  },
});
