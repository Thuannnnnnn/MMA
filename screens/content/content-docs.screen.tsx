import { Content } from '@/constants/Content/contentList'; // Adjust import based on actual structure
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import React, {useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Button, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const PDFViewer = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
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

  // Type guard to check if item is of type Docs
  const isDocs = (item: Content): item is Extract<Content, { contentType: 'docs' }> => {
    return item.contentType === 'docs' && item.contentRef?.docsLink !== undefined;
  };

  // Construct PDF URL if item is of type Docs
  const pdfUrl = item && isDocs(item) 
    ? `https://docs.google.com/gview?embedded=true&url=${item.contentRef.docsLink}?nocache=${new Date().getTime()}`
    : '';

  const MakeIsComplete = () => {
    navigation.goBack();
  };

  const handleWebViewError = (syntheticEvent: { nativeEvent: any; }) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('Error loading page', nativeEvent);
    Alert.alert("Error", "Failed to load PDF document.");
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      )}
      {pdfUrl ? (
        <WebView
          source={{ uri: pdfUrl }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          cacheEnabled={false}
          cacheMode="LOAD_NO_CACHE"
          startInLoadingState={false}
          onLoadEnd={() => setLoading(false)}
          onHttpError={handleWebViewError}
          onError={handleWebViewError}
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text>No PDF available to display.</Text>
          <Button title="Go Back" onPress={MakeIsComplete} />
        </View>
      )}
      <View>
        <Button title="Make is Complete" onPress={MakeIsComplete} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PDFViewer;
