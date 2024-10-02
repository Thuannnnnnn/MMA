import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, Alert, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getPaymentUrl } from '@/API/Payment/paymentAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { paymentUrl } from '@/constants/Payment/payment';
import queryString from 'query-string';

export default function Payment() {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);  // Added state for loading

  useEffect(() => {
    const getUrl = async () => {
      try {
        const token =`Bearer ${await AsyncStorage.getItem('token')}`
        console.log(token)
        const amount = 10000
        if (token) {
          const result: paymentUrl = await getPaymentUrl(amount, token);
          setUrl(result.paymentUrl);
        } else {
          console.warn('Token is null, unable to fetch payment URL');
        }
      } catch (error) {
        console.error('Error fetching payment URL:', error);
      } finally {
        setLoading(false);
      }
    };

    getUrl();
  }, []);
  console.log(url)
  const handleNavigationChange = (navState: { url: string }) => {
    const { url } = navState;

    if (url.startsWith('http://localhost:8080/vnpay-return')) {
      const parsedParams = queryString.parseUrl(url).query;
      const paymentStatus = parsedParams.paymentStatus || 'Unknown';
      Alert.alert('Payment Status', `Payment was: ${paymentStatus}`);
      router.push("/(routes)/payment/paymentSuccess");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        url && (
          <WebView
            source={{ uri: url }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            cacheEnabled={false}
            cacheMode="LOAD_NO_CACHE"
            startInLoadingState={true}
            onNavigationStateChange={handleNavigationChange} // Listen for navigation changes
          />
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
