import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import signInImage from '@/assets/sign-in/signup.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import { styles } from '@/styles/forgotPassword/forgotPassword';

export default function InputEmailScreen() {
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState({ message: '' });

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async () => {
    
    setError({ message: '' });

    
    if (!isValidEmail(email)) {
      setError({ message: 'Please enter a valid email address.' });
      return;
    }

    try {
      setButtonSpinner(true);
      // const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/fogot-password`, {
        const response = await axios.post(`http://192.168.1.8:8080/api/auth/fogot-password`, {
        email,
      });
      if (response.status === 200) {
        await AsyncStorage.setItem('email', email);
        router.push({
          pathname: '/(routes)/forgotPassword/inputOTP',
          params: {},
        });
      } else {
        setError({ message: response.data.message || 'An error occurred, please try again.' });
      }
      setButtonSpinner(false);
    } catch (error) {
      console.error('Error sending forgot password request:', error);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const errorMessage = (axiosError.response?.data as { message: string }).message || 'A connection error occurred, please check your network again.';
        setError({ message: errorMessage });
      } else {
        setError({ message: 'A network error occurred, please try again.' });
      }
      setButtonSpinner(false);
    }
  };

  return (
    <LinearGradient colors={['#E5ECF9', '#F6F7F9']} style={{ flex: 1, paddingTop: 20 }}>
      <ScrollView>
        <Image style={styles.signInImage} source={signInImage} />

        <Text style={styles.welcomeText}>Forgot password?</Text>
        <Text style={styles.learningText}>Enter your email address to reset your password</Text>

        <View style={[styles.inputContainer]}>
          
          <View style={styles.emailInputContainer}>
            <FontAwesome name="envelope" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.emailInput}
              placeholder="Please enter your Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleForgotPassword}
            disabled={buttonSpinner}
          >
            {buttonSpinner ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Submit request</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signUpRedirect}>
            <Text style={{ fontSize: 18 }}>Back to login</Text>
            <TouchableOpacity onPress={() => router.push("/(routes)/login")}>
              <Text style={styles.redirectText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(routes)/forgotPassword/inputOTP")}>
              <Text style={styles.redirectText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(routes)/forgotPassword/newPassword")}>
              <Text style={styles.redirectText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
