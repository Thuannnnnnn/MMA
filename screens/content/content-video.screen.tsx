import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video, ResizeMode } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function ContentVideo() {
  const [item, setItem] = useState<{ title: string; videoUri: string } | null>(null);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedItem = await AsyncStorage.getItem('@selectedItem');
        console.log(storedItem);
        if (storedItem) {
          setItem(JSON.parse(storedItem));
        }
      } catch (e) {
        console.error('Error fetching item', e);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (item) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, [item]);

  return (
    <SafeAreaView style={styles.container}>
      {item ? (
        <Video
          ref={videoRef}
          source={{ uri: item.videoUri }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          style={styles.video}
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
});
