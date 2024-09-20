import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import signInImage from '@/assets/sign-in/signup.png';
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OtpInput } from 'react-native-otp-entry';
import { styles } from '@/styles/forgotPassword/forgotPassword';

export default function InputOtpScreen() {
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState({ message: '' });

  
  useEffect(() => {
    const retrieveEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail === null) {
        console.log('Email not saved or deleted.');
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
    setOtp(text);
  };

  const handleVerifyOtp = async () => {
    try {
      setButtonSpinner(true);
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/auth/validate-otp`, // Ensure you have the correct base URL here
        {
          email,
          otpCode: otp,
        }
      );

      if (response.status === 200) {
        router.push({
          pathname: '/(routes)/forgotPassword/newPassword',
          params: { email },
        });
      } else {
        setError({ message: 'Invalid OTP code. Please try again.' });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          setError({ message: data.message || 'OTP not found. Please try again.' });
        } else if (status === 400) {
          setError({ message: data.message || 'OTP has expired. Please request a new one.' });
        } else {
          setError({ message: 'An unexpected error occurred. Please try again.' });
        }
      } else {
        setError({ message: 'A connection error occurred. Please check your network and try again.' });
      }
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
