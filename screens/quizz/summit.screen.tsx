import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import successAnimation from '../../success.json';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const SummitScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/(routes)/quizz/quizzResults");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View style={styles.container}>
      <LottieView
        source={successAnimation}
        autoPlay
        loop={false}
        resizeMode="contain"
        style={{ width: width, height: height}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Màu nền trắng
  },
});

export default SummitScreen;
