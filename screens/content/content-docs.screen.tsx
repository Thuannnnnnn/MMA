import { useNavigation } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { WebView } from 'react-native-webview';

const PDFViewer = () => {
  const navigation = useNavigation();
  const [key, setKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const pdfUrl = `https://docs.google.com/gview?embedded=true&url=https://www.aeee.in/wp-content/uploads/2020/08/Sample-pdf.pdf?nocache=${new Date().getTime()}`;

  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  const reloadPDF = useCallback(() => {
    setLoading(true);
    setKey(prevKey => prevKey + 1); // Tăng key để tái tạo WebView
  }, []);

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      )}
      <WebView
        key={key}
        source={{ uri: pdfUrl }}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={false}
        cacheMode="LOAD_NO_CACHE"
        startInLoadingState={false}
        onLoadEnd={() => setLoading(false)}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('HTTP Error', nativeEvent);
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('Error loading page', nativeEvent);
        }}
      />
      <View>
        <Button title="make complete" onPress={reloadPDF} />
      </View>
    </View>
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
});

export default PDFViewer;
