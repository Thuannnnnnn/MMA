import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Text, Dimensions, View } from 'react-native';
import { Entypo, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
// import { ProgressBar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import { getContentById } from '@/API/Content/ContentApi';
import { Course, Content } from '@/constants/Content/contentList';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ContentList() {
  const router = useRouter();
  const [data, setData] = useState<Content[]>([]);
  useEffect(() => {

    const fetchData = async () => {
      try {
        const token = `Bearer ${await AsyncStorage.getItem('token')}`;
        const courseId = await AsyncStorage.getItem('courseIdGotoContent');
        if (token && courseId) {
          const result: Course = await getContentById(courseId, token);
          setData(result.contents);
        } else {
          console.warn('Token is null, unable to fetch content');
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
    lockOrientation();
  }, []);

 
  const handlePress = async (item: Content) => {
    try {
      await AsyncStorage.setItem('@selectedItem', JSON.stringify(item));
    } catch (e) {
      console.error('Error saving item', e);
    }
    switch (item.contentType) {
      case 'videos':
        router.push({
          pathname: '/(routes)/content/content-video',
        });
        break; 
      case 'docs':
        router.push({
          pathname: '/(routes)/content/content-docs',
        });
        break; 
      case 'questions':
        router.push({
          pathname: '/(routes)/quizz',
        });
        break; 
      case 'exams':
        router.push({
          pathname: '/(routes)/content/content-video',
        });
        break; 
      default:
        break;
    }
  };

  const renderCourse = ({ item }: { item: Content }) => {
    return (
      <View style={styles.courseCard} onTouchEnd={() => handlePress(item)}>
        <View style={styles.iconContainerType}>
          <Entypo name="video" size={30} color="black" />
        </View>
        <View style={styles.courseDetails}>
          <Text style={styles.courseTitle}>{item.contentName}</Text>
          <Text style={styles.courseType}>
            <MaterialCommunityIcons name="format-list-bulleted-type" size={18} color="black" /> {item.contentType}
          </Text>
          {/* <ProgressBar progress={0} color="#3FA2F6" style={styles.progressBar} /> */}
        </View>
        <View style={styles.iconContainerPlay}>
          <AntDesign name="caretright" size={20} color="black" />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleHeader}>Content List</Text>
      <FlatList
        data={data}
        renderItem={renderCourse}
        keyExtractor={(item) => item.contentId}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleHeader: {
    fontSize: 30,
    marginTop: 30,
    marginLeft: 30,
    fontWeight: '900',
    marginBottom: 40,
  },
  courseCard: {
    flexDirection: 'row',
    marginBottom: screenHeight * 0.02,
    backgroundColor: '#fff',
    borderRadius: screenWidth * 0.02,
    elevation: 2,
    marginLeft: 20,
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  courseDetails: {
    flex: 1,
    padding: screenWidth * 0.03,
  },
  courseTitle: {
    fontSize: screenWidth * 0.045,
    fontWeight: 'bold',
    color: '#FF7F3E',
  },
  courseType: {
    fontSize: screenWidth * 0.04,
    fontWeight: '600',
  },
  iconContainerType: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 10,
    width: 60,
    height: 60,
    backgroundColor: '#CAF4FF',
    borderRadius: 30,
  },
  iconContainerPlay: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  progressBar: {
    marginTop: 10,
    height: 10,
    borderRadius: 5,
  },
});
