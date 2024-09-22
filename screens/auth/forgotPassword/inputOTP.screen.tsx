import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import signInImage from '@/assets/sign-in/signup.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OtpInput } from 'react-native-otp-entry';
import { styles } from '@/styles/forgotPassword/forgotPassword';
import { validateOtp } from '@/API/ForgotPassword/forgotPassword';

export default function InputOtpScreen() {
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [email, setEmail] = useState('');
 
  const [error, setError] = useState({ message: '' });
  const [userInfo, setUserInfo] = useState({
    otp: '',
    email:'',
  });
  

  
  useEffect(() => {
    const retrieveEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail === null) {
        
        router.push({
          pathname: '/(routes)/login',
          
        });
        
      } else {
        setEmail(storedEmail);
      }
    };
    retrieveEmail();
  }, []);

  const handleOtpChange = (text: string) => {
    setUserInfo((prevState) => ({
      ...prevState,
      otp: text,
    }));
  };

  const handleVerifyOtp = async () => {
    try {
      setButtonSpinner(true);
      await validateOtp({ email, otpCode: userInfo.otp });

      await AsyncStorage.setItem('otpCode', userInfo.otp);
      router.push({
        pathname: '/(routes)/forgotPassword/newPassword',
        params: { email },
      });
    } catch (error: any) {
      setError({
        message: error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setButtonSpinner(false);
    }
  };

  return (
    <LinearGradient colors={['#E5ECF9', '#F6F7F9']} style={{ flex: 1, paddingTop: 20 }}>
      <ScrollView>
        <Image style={styles.signInImage} source={signInImage} />

        <Text style={styles.welcomeText}>OTP code authentication</Text>
        <Text style={styles.learningText}>We have sent a verification code to your email.</Text>

        <View style={[styles.inputContainer]}>
          <OtpInput
            numberOfDigits={4}
            onTextChange={handleOtpChange}
            focusColor={'#2467EC'}
            focusStickBlinkingDuration={400}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: '#fff',
                width: 58,
                height: 58,
                borderRadius: 12,
              },
            }}
          />
          {error.message && (
            <View style={styles.errorContainer}>
              <Entypo name="cross" size={18} color={'red'} />
              <Text style={{ color: 'red', marginLeft: 5 }}>{error.message}</Text>
            </View>
          )}
          <TouchableOpacity
            style={{
              padding: 16,
              borderRadius: 8,
              marginHorizontal: 16,
              backgroundColor: '#2467EC',
              marginTop: 30,
            }}
            onPress={handleVerifyOtp}
          >
            {buttonSpinner ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Authentication
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(routes)/login')}>
            <Text style={{ fontSize: 18, color: '#2467Ec', marginLeft: 5, textAlign: 'center' }}>
              Back to login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
