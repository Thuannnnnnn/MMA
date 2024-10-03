import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video, ResizeMode, VideoFullscreenUpdate, VideoFullscreenUpdateEvent } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Content } from '@/constants/Content/contentList';

export default function ContentVideo() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<Video>(null);
  const [item, setItem] = useState<Content | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedItem = await AsyncStorage.getItem('@selectedItem');
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
    const handleFullscreen = async () => {
      if (isFullscreen) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      }
    };

    handleFullscreen();

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, [isFullscreen]);

  return (
    <SafeAreaView style={styles.container}>
      {item && item.contentRef && item.contentType === 'videos' ? (
        <Video
          ref={videoRef}
          source={{ uri: item.contentRef.videoLink }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          style={styles.video}
          useNativeControls
          onFullscreenUpdate={(event: VideoFullscreenUpdateEvent) => {
            switch (event.fullscreenUpdate) {
              case VideoFullscreenUpdate.PLAYER_DID_PRESENT:           
                setIsFullscreen(true);
                break;          
              case VideoFullscreenUpdate.PLAYER_DID_DISMISS:            
                setIsFullscreen(false);
                break;
            }
          }}
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
