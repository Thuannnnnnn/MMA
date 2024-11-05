import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import AvatarPng from "@/assets/homePage/avatar.png";
import { fetchCourses } from "@/API/HomePage/homePageAPI";
import {
  fetchCoursesByPriceAsc,
  fetchCoursesByPriceDesc,
  fetchCoursesByRatingDesc,
} from "@/API/FilterCourse/filterCourse";
import { Course } from "@/constants/HomePage/course";
import { SlideData } from "@/constants/HomePage/slideData";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { fetchSearchCourses } from "@/API/SearchCourse/searchCourseAPI";

import avartar from "@/assets/homePage/1.png";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const slides: SlideData[] = [
  { key: "1", title: "Langueges C", img: avartar, backgroundColor: "#CEECFE" },
  {
    key: "2",
    title: "Langueges Java",
    img: avartar,
    backgroundColor: "#EFE0FF",
  },
  {
    key: "3",
    title: "Langueges Nodejs",
    img: avartar,
    backgroundColor: "#e2e9f9",
  },
];
export default function HomeScreen() {
  const [query, setQuery] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<
    "priceAsc" | "priceDesc" | "ratingDesc"
  >("priceAsc");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if(userDataString){
          const userData = JSON.parse(userDataString);
          const {avatarUrl } = userData;
          setUserAvatar(avatarUrl)
        }
        const token = `Bearer ${await AsyncStorage.getItem("token")}`;
        const fetchedCourses = await fetchCourses(token);
        setCourses(fetchedCourses);
        setDisplayedCourses(fetchedCourses.slice(0, 4));
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    const loadSearchCourses = async () => {
      if (query.length > 0) {
        setIsSearching(true);
        try {
          const token = `Bearer ${await AsyncStorage.getItem("token")}`;
          const fetchedSearchCourses = await fetchSearchCourses(query, token);
          setSearchResults(fetchedSearchCourses as unknown as Course[]);
        } catch (error) {
          console.error("Search error:", error);
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
      setCurrentSlideIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
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

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const token = `Bearer ${await AsyncStorage.getItem("token")}`;
        let fetchedCourses: Course[];

        if (sortOrder === "priceAsc") {
          fetchedCourses = await fetchCoursesByPriceAsc(token);
        } else if (sortOrder === "priceDesc") {
          fetchedCourses = await fetchCoursesByPriceDesc(token);
        } else {
          fetchedCourses = await fetchCoursesByRatingDesc(token);
        }

        setCourses(fetchedCourses);
        setDisplayedCourses(fetchedCourses.slice(0, 4));
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [sortOrder]);

  const togglePriceSortOrder = () => {
    setSortOrder((prevOrder) =>
      prevOrder === "priceAsc" ? "priceDesc" : "priceAsc"
    );
  };

  const handleSortByRating = () => {
    setSortOrder("ratingDesc");
  };

  const loadMoreCourses = () => {
    if (displayedCourses.length < courses.length && !isSearching) {
      setLoadingMore(true);
      const nextCourses = courses.slice(
        displayedCourses.length,
        displayedCourses.length + 4
      );
      setTimeout(() => {
        setDisplayedCourses((prev) => [...prev, ...nextCourses]);
        setLoadingMore(false);
      }, 1000);
    }
  };

  const goToDetail = async (courseId: string) => {
    AsyncStorage.setItem("courseId_detail", courseId);
    router.push({
      pathname: "/(routes)/courseDetails",
    });
  };

  const renderCourses = (items: Course[]) =>
    items.map((item) => (
      <TouchableOpacity
        key={item.courseId}
        onPress={() => goToDetail(item.courseId)}
        style={styles.courseCard}
      >
        {item.posterLink ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.posterLink }}
              style={styles.courseImage}
            />
          </View>
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <View style={styles.courseDetails}>
          <Text style={styles.courseTitle}>{item.courseName}</Text>
          <Text></Text>
          <Text style={styles.coursePrice}>{parseFloat(item.price).toLocaleString("vi-VN")}{" "} ₫</Text>
          {sortOrder === "ratingDesc" && (
            <Text style={styles.courseRating}>
              Rating: {item.averageRating}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    ));

  return (
    <LinearGradient
      colors={["#ffffff", "#e2e9f9", "#d7e2fb"]}
      style={styles.gradient}
    >
      <ScrollView onScrollEndDrag={loadMoreCourses} scrollEventThrottle={16}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Home Page</Text>
              <TouchableOpacity onPress={()=> router.push("/(tabs)/profile")}>
              <Image style={styles.avatar} source={userAvatar ? { uri: `${userAvatar}?timestamp=${new Date().getTime()}` } : AvatarPng} />
              </TouchableOpacity>
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
                  <View
                    key={slide.key}
                    style={[
                      styles.slide,
                      { backgroundColor: slide.backgroundColor },
                    ]}
                  >
                    <Image source={slide.img} style={styles.image} />
                    <Text style={styles.slideTextContainer}>{slide.title}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={styles.sortContainer}>
              {/* Price Sort Icon */}
              <TouchableOpacity
                onPress={togglePriceSortOrder}
                style={styles.iconButton}
              >
                <FontAwesome
                  name={
                    sortOrder === "priceAsc"
                      ? "sort-amount-asc"
                      : "sort-amount-desc"
                  }
                  size={14}
                  color="#3D5CFF"
                />
                <Text style={styles.sortButtonText}>Price</Text>
              </TouchableOpacity>
    

              {/* Rating Sort Icon */}
              <TouchableOpacity
                onPress={handleSortByRating}
                style={styles.iconButton}
              >
                <FontAwesome
                  name="star"
                  size={14}
                  color={sortOrder === "ratingDesc" ? "#FFD700" : "#3D5CFF"}
                />
                <Text style={styles.sortButtonText}>Rating</Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <ScrollView>
                {renderCourses(isSearching ? searchResults : displayedCourses)}
                {loadingMore && !isSearching && (
                  <ActivityIndicator size="small" color="#0000ff" />
                )}
              </ScrollView>
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
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  sortButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#d7e2fb",
    borderRadius: 8,
  },
  sortButtonText: { fontSize: 16, fontWeight: "500", color: "#3D5CFF" },
  iconButton: { alignItems: 'center' },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: screenHeight * 0.02,
  },
  courseRating: {
    fontSize: screenWidth * 0.04,
    color: "#FFD700", // Gold color for the rating
    fontWeight: "bold",
    marginTop: 5,
  },
  title: {
    fontSize: screenWidth * 0.04,
    fontWeight: "bold",
  },
  avatar: {
    width: screenWidth * 0.1,
    height: screenHeight * 0.08,
    borderRadius: screenWidth * 0.02,
  },
  inputContainer: {
    marginVertical: screenHeight * 0.02,
    borderRadius: screenWidth * 0.02,
    backgroundColor: "white",
  },
  input: {
    height: screenHeight * 0.06,
    paddingHorizontal: screenWidth * 0.03,
    fontSize: screenWidth * 0.04,
  },
  sliderContainer: {
    marginBottom: screenHeight * 0.02,
    borderRadius: screenWidth * 0.02,
  },
  slide: {
    height: screenHeight * 0.15,
    width: screenWidth * 0.7,
    borderRadius: screenWidth * 0.05,
    marginHorizontal: screenWidth * 0.02,
    elevation: 2,
    paddingHorizontal: screenWidth * 0.02,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    marginRight: screenWidth * 0.03,
    position: "absolute",
    right: screenWidth * 0.16,
    borderRadius: screenWidth * 0.05,
  },
  slideTextContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: screenWidth * 0.02,
    borderTopLeftRadius: screenWidth * 0.05,
    borderBottomLeftRadius: screenWidth * 0.05,
    position: "absolute",
    left: screenWidth * 0.305,
    top: screenWidth * 0.16,
    minWidth: "60%",
    fontWeight: "bold",
    fontSize: screenWidth * 0.04,
  },
  courseCard: {
    flexDirection: "row",
    marginBottom: screenHeight * 0.02,
    backgroundColor: "#fff",
    borderRadius: screenWidth * 0.02,
    overflow: "hidden",
    elevation: 2,
  },
  imageContainer: {
    margin: 10,
  },
  courseImage: {
    width: screenWidth * 0.22,
    height: screenHeight * 0.1,
    resizeMode: "stretch",
    borderRadius: screenWidth * 0.02,
  },
  courseDetails: {
    flex: 1,
    padding: screenWidth * 0.03,
  },
  courseTitle: {
    fontSize: screenWidth * 0.05,
    fontWeight: "bold",
  },
  coursePrice: {
    fontSize: screenWidth * 0.04,
    fontWeight: "bold",
    color: "#3D5CFF",
  },
  placeholderImage: {
    width: screenWidth * 0.25,
    height: screenHeight * 0.12,
    backgroundColor: "#e0e0e0",
  },
});
