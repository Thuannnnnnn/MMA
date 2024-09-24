import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Text, Dimensions, View } from 'react-native';
import { Entypo, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
type ItemProps = {
  id: string;
  title: string;
  uri: string; 
  videoUri: string;  
  type: string;
  progress: number;
};


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ContentList() {
  const router = useRouter();
  
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
    lockOrientation();
  }, []);

  const DATA: ItemProps[] = [
    {
      id: '1',
      title: 'First Item',
      uri: 'https://example.com/image1.png',
      videoUri: 'https://sdn111.blob.core.windows.net/videosdn/70ced783-489a-41d0-841a-4612fc7e8d67.mp4',
      type: 'video',
      progress: 1,
    },
    {
      id: '2',
      title: 'Second Item',
      uri: 'https://example.com/image2.png',
      videoUri: 'https://sdn111.blob.core.windows.net/videosdn/video2.mp4',
      type: 'document',
      progress: 1,
    },
    {
      id: '3',
      title: 'Third Item',
      uri: 'https://example.com/image3.png',
      videoUri: 'https://sdn111.blob.core.windows.net/videosdn/video3.mp4',
      type: 'quiz',
      progress: 0.5,
    },
    {
      id: '4',
      title: 'Fourth Item',
      uri: 'https://example.com/image4.png',
      videoUri: 'https://sdn111.blob.core.windows.net/videosdn/video4.mp4',
      type: 'quiz',
      progress: 0,
    },
  ];

  const handlePress = async (item: ItemProps) => {
    try {
      await AsyncStorage.setItem('@selectedItem', JSON.stringify(item));
    } catch (e) {
      console.error('Error saving item', e);
    }
    switch(item.type){
      case 'video':
        router.push({
          pathname: '/(routes)/content/content-video',
          params: {
            title: item.title,
            videoUri: item.videoUri,
          },
        });
        break;
        case 'docs':
          router.push({
            pathname: '/(routes)/content/content-video',
            params: {
              title: item.title,
              videoUri: item.videoUri,
            },
          });
          break;
        case 'quiz':
          router.push({
            pathname: '/(routes)/content/content-video',
            params: {
              title: item.title,
              videoUri: item.videoUri,
            },
          });
          break;
        case 'exam':
          router.push({
            pathname: '/(routes)/content/content-video',
            params: {
              title: item.title,
              videoUri: item.videoUri,
            },
          });
    }
  };

  const renderCourse = ({ item }: { item: ItemProps }) => {
    return (
      <View style={styles.courseCard} onTouchEnd={() => handlePress(item)}>
        <View style={styles.iconContainerType}>
          <Entypo name="video" size={30} color="black" />
        </View>
        <View style={styles.courseDetails}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.courseType}>
            <MaterialCommunityIcons name="format-list-bulleted-type" size={18} color="black" /> {item.type}
          </Text>
          <ProgressBar progress={item.progress} color="#3FA2F6" style={styles.progressBar} />
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
        data={DATA}
        renderItem={renderCourse} // Sử dụng trực tiếp renderCourse
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}

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
    marginLeft:10,
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
