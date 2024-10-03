import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, Alert, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getPaymentUrl, creatOrder } from '@/API/Payment/paymentAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { paymentUrl } from '@/constants/Payment/payment';
import queryString from 'query-string';
import { CartItem } from '@/constants/Cart/cartList';
import { deleteCourseOrder } from "@/API/Cart/cartAPI";

export default function Payment() {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false); // State for transition loading

  useEffect(() => {
    const getUrl = async () => {
      try {
        setLoading(true);
        const token = `Bearer ${await AsyncStorage.getItem('token')}`;
        const storedCartItems = await AsyncStorage.getItem("cartItems");
        const cartItems = storedCartItems ? JSON.parse(storedCartItems) : null;
        
        if (!cartItems) {
          console.warn("No cart items found in AsyncStorage.");
          return;
        }

        const amountString = await AsyncStorage.getItem("totalPrice");
        const amount = amountString ? parseFloat(amountString) : 0;
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

  const handleNavigationChange = async (navState: { url: string }) => {
    const { url } = navState;
    setIsTransitioning(true); // Start spinner during transition

    if (url.startsWith('http://localhost:8080/vnpay-return')) {
      const parsedParams = queryString.parseUrl(url).query;
      const responseCode = parsedParams.vnp_ResponseCode || 'Unknown';

      if (responseCode === '00') {
        const token = `Bearer ${await AsyncStorage.getItem('token')}`;
        const storedCartItems = await AsyncStorage.getItem("cartItems");

        if (storedCartItems) {
          try {
            const cartItems = JSON.parse(storedCartItems);
            const userEmail = cartItems.userGenerated;
            const courses = cartItems.courses.map((course: CartItem) => ({
              courseId: course.courseId._id,
              purchaseDate: new Date(),
            }));
            const cartId = cartItems.cartId;
            const amountString = await AsyncStorage.getItem("totalPrice");
            const amount = amountString ? parseFloat(amountString) : 0;
            creatOrder(userEmail, amount, courses, token);

            if (cartId) {
              deleteCourseOrder(cartId, token, courses);
              await AsyncStorage.removeItem("totalPrice");
              await AsyncStorage.removeItem("cartItems");
            }

            router.push("/(routes)/payment/paymentSuccess");
          } catch (error) {
            console.error('Error creating order:', error);
            router.push("/(routes)/payment/paymentError");
          }
        } else {
          console.warn('Cart items or user email not found.');
        }
      } else {
        Alert.alert('Payment Status', `Payment failed with error code: ${responseCode}`);
        router.push("/(routes)/payment/paymentError");
      }
    }

    setIsTransitioning(false); // Stop spinner after transition completes
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading || isTransitioning ? ( // Show loading if page is loading or transitioning
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
