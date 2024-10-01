import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
//import { useNavigation } from '@react-navigation/native'; // Make sure you have react-navigation installed

export default function Payment() {
  //const navigation = useNavigation();

  const handleNavigationChange = (navState: { url: any; }) => {
    const { url } = navState;

    // Check if the URL is the return URL after payment
    if (url.startsWith('http://localhost:8080/vnpay-return')) {
      // Handle the response from the payment gateway
      // You can parse the URL to get payment status and other parameters if needed
      const params = new URL(url).searchParams;
      const paymentStatus = params.get('paymentStatus'); // Example: Get payment status
      Alert.alert('Payment Status', `Payment was: ${paymentStatus}`);
      router.push("/(routes)/login")
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{
          uri: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=2000000&vnp_Command=pay&vnp_CreateDate=20241001181530&vnp_CurrCode=VND&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Payment+for+buy+course&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A8080%2Fvnpay-return&vnp_TmnCode=05HCIENO&vnp_TxnRef=1234567&vnp_Version=2.1.0&vnp_SecureHash=90010d81dd4cfcaa254491c62179038b12320a5ab1ef49487f02b27bba0366edc871931a01798bc6c495c640f62723f1763c40672fb7dfba44bae862628a5f68',
        }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={false}
        cacheMode="LOAD_NO_CACHE"
        startInLoadingState={true}
        onNavigationStateChange={handleNavigationChange} // Listen for navigation changes
      />
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
});
