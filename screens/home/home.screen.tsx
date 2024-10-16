import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, ActivityIndicator, FlatList, Alert, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AvatarPng from '@/assets/homePage/avatar.png';
import { fetchCourses } from '@/API/HomePage/homePageAPI';
import { Course } from '@/constants/HomePage/course';
import { SlideData } from '@/constants/HomePage/slideData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { fetchSearchCourses } from '@/API/SearchCourse/searchCourseAPI';

import imgJava from '@/assets/java.jpg';
import imgC from '@/assets/C.jpg';
import imgNodejs from '@/assets/Nodejs.jpg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const slides: SlideData[] = [
  { key: '1', title: 'Slide 1', img: imgJava, backgroundColor: '#f7e9e9' },
  { key: '2', title: 'Slide 2', img: imgC, backgroundColor: '#e2f9e2' },
  { key: '3', title: 'Slide 3', img: imgNodejs, backgroundColor: '#e2e9f9' },
];

export default function HomeScreen() {
  const [query, setQuery] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Load danh sách khóa học ban đầu
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const token = `Bearer ${await AsyncStorage.getItem('token')}`;
        const fetchedCourses = await fetchCourses(token);
        setCourses(fetchedCourses);
        setDisplayedCourses(fetchedCourses.slice(0, 4));
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  // Xử lý tìm kiếm
  useEffect(() => {
    const loadSearchCourses = async () => {
      if (query.length > 0) {
        setIsSearching(true);
        try {
          const token = `Bearer ${await AsyncStorage.getItem('token')}`;
          const fetchedSearchCourses = await fetchSearchCourses(query, token);
          setSearchResults(fetchedSearchCourses as unknown as Course[]);
        } catch (error) {
          console.log('Search error:', error);
        }
      } else {
        setIsSearching(false);
        setDisplayedCourses(courses.slice(0, 4));
      }
    };
    loadSearchCourses();
  }, [query, courses]);


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
    if (displayedCourses.length < courses.length && !isSearching) {
      setLoadingMore(true);
      const nextCourses = courses.slice(displayedCourses.length, displayedCourses.length + 4);
      setTimeout(() => {
        setDisplayedCourses((prev) => [...prev, ...nextCourses]);
        setLoadingMore(false);
      }, 1000);
    }
  };

  const goToDetail = async (courseId: string) => {
    AsyncStorage.setItem('courseId_detail', courseId);
    router.push({
      pathname: '/(routes)/courseDetails',
    });
  };

  const renderCourse = ({ item }: { item: Course }) => (
    <TouchableOpacity onPress={() => goToDetail(item.courseId)} style={styles.courseCard}>
      {item.posterLink ? (
        <Image source={{ uri: item.posterLink }} style={styles.courseImage} />
      ) : (
        <View style={styles.placeholderImage} /> // Hoặc một thành phần placeholder khác
      )}
      <View style={styles.courseDetails}>
        <Text style={styles.courseTitle}>{item.courseName}</Text>
        <Text style={styles.coursePrice}>Price: {item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    
    <LinearGradient colors={['#ffffff', '#e2e9f9', '#d7e2fb']} style={styles.gradient}>
      <ScrollView>
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
                {slides.map((slide) => (
                  <View key={slide.key} style={[styles.slide, { backgroundColor: slide.backgroundColor }]}>
                       <Image source={slide.img} style={styles.image} />
                  </View>
                ))}
              </ScrollView>
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FlatList
                nestedScrollEnabled={true} 
                data={isSearching ? searchResults : displayedCourses}
                renderItem={renderCourse}
                keyExtractor={(item) => item.courseId}
                onEndReached={loadMoreCourses}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore && !isSearching ? <ActivityIndicator size="small" color="#0000ff" /> : null}
               
              />
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
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
    borderRadius: screenWidth * 0.02,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight * 0.33,
    width: screenWidth * 0.7,
    borderRadius: screenWidth * 0.02,
    marginHorizontal: screenWidth * 0.01,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: screenWidth * 0.02,
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
  placeholderImage: {
    width: screenWidth * 0.25,
    height: screenHeight * 0.12,
    backgroundColor: '#e0e0e0',
  },
});
