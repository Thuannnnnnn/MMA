import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ContentVideo() {
  const [item, setItem] = useState<{ title: string; videoUri: string } | null>(null);

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

  return (
    <SafeAreaView style={styles.container}>
      {item ? (
        <>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.videoUri}>{item.videoUri}</Text>
          {/* You can embed a video player here using a library like react-native-video */}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  videoUri: {
    fontSize: 16,
    color: 'gray',
  },
});
