import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import signInImage from '@/assets/sign-in/signup.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  { AxiosError } from 'axios';
import { styles } from '@/styles/forgotPassword/forgotPassword';
import { sendOtpForgotPassword } from '@/API/ForgotPassword/forgotPassword';

export default function InputEmailScreen() {
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [error, setError] = useState({ message: '' });
  const [userInfo, setUserInfo] = useState({
    email: '',
  });

  // const isValidEmail = (email: string) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };


    const handleForgotPassword = async () => {
      try {
       
    
        setButtonSpinner(true);
        await sendOtpForgotPassword({ email : userInfo.email });
    
     
        await AsyncStorage.setItem('email', userInfo.email);
    
        router.push({
          pathname: '/(routes)/forgotPassword/inputOTP',
          params: {}, 
        });
    
        setButtonSpinner(false);
      } catch (error) {
        console.error('Reset password failed:', error);
    
        if (error instanceof AxiosError) {
      
          setError({
            message: error.response?.data?.message || 'An error occurred during the reset password process.',
          });
        } else {
         
          setError({
            message: 'An error occurred during the reset password process.',
          });
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
              value={userInfo.email}
              onChangeText={(value) => setUserInfo({ ...userInfo, email: value })}
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
            
          </View>
        </View>

        <View>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
