import { useState, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, SectionList, Text  } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import WebView from 'react-native-webview';

export default function contentVideo() {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const DATA = [
    {
      title: 'Main dishes',
      data: ['Pizza', 'Burger', 'Risotto'],
    },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
    <WebView
      style={styles.container}
      source={{ uri: 'https://sdn111.blob.core.windows.net/videosdn/70ced783-489a-41d0-841a-4612fc7e8d67.mp4' }}
      allowsFullscreenVideo={true}
   />
      {/* <Video
        ref={video}
        style={styles.video}
        source={{
          uri: 'https://sdn111.blob.core.windows.net/videosdn/123.mp4',
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
        usePoster
      /> */}
      <ScrollView style={styles.scrollContainer}>
        <SectionList
          sections={DATA}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.title}>{item}</Text>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    position: 'absolute', // Giữ video cố định
    top: 0, // Đặt ở đầu màn hình
    left: 0,
    right: 0,
    width: '100%', // Chiếm toàn bộ chiều rộng
    height: '40%', // Chiếm 40% chiều cao màn hình
    zIndex: 1, // Hiển thị trên các thành phần khác
  },
  scrollContainer: {
    flex: 1,
    //marginTop: '10%', // Đẩy nội dung xuống dưới video
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
});
