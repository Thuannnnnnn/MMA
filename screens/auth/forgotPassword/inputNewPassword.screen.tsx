import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import signInImage from '@/assets/sign-in/signup.png';
import { styles } from '@/styles/forgotPassword/forgotPassword';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InputNewPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  
  const [userInfo, setUserInfo] = useState({
    email: '',
    otp: '',
    password: '',
    rePassword:'',
  });

  const [error, setError] = useState({
    errorMessage: '',
   
  });
  useEffect(() => {
    const getOtpandEmail = async () => {
      const emailUser = await AsyncStorage.getItem('email');
      const otpCode = await AsyncStorage.getItem('otpCode');
      setUserInfo((prevState) => ({
        ...prevState,
        otp: otpCode ?? '',
        email: emailUser ?? '',
      }));
    };
    getOtpandEmail();
  }, []);
  const route = useRoute();
  const { email } = route.params as { email: string };
  const handlePasswordValidation = (password: string, rePassword: string ) => {

    const passwordSpecialCharacter = /(?=.*[!@#$%^&*()_\-+=<>?/{}~|[\]\\:;'"`.,])/;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordSixValue = /(?=.{6,})/;

    let errorMessage = '';

    if (!passwordSpecialCharacter.test(password) || !passwordSpecialCharacter.test(rePassword)) {
        setError ({errorMessage: 'Password must contain at least one special character.'});
        setUserInfo({... userInfo, password: "", rePassword: ""})
        return false;
      } 


    if (!passwordOneNumber.test(password) || !passwordOneNumber.test(rePassword)) {
        setError ({errorMessage: 'Password must contain at least one number.'});
        setUserInfo({... userInfo, password: "", rePassword: ""})
        return false;
      }

    if (!passwordSixValue.test(password) || !passwordSixValue.test(rePassword)) {
        setError ({errorMessage: 'Password must contain at least six characters.'});
        setUserInfo({... userInfo, password: "", rePassword: ""})
        return false;
      }

    
    
    return true;
    
  };

  const handleResetPassword = async () => {
    try {
      setButtonSpinner(true);
      setError({ errorMessage: '' });

      if (!handlePasswordValidation(userInfo.password, userInfo.rePassword)) {
        
        setButtonSpinner(false);
        return;
      }
      if (userInfo.password !== userInfo.rePassword) {
        setError({ errorMessage: 'Passwords do not match.' });
        setButtonSpinner(false);
        return;
      }
     
      
      const response = await axios.post(
        // `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/auth/change-password`,
        `http://192.168.1.8:8080/api/auth/change-password`,
        { email: userInfo.email,
          otpCode : userInfo.otp,
          oldPW: userInfo.password,
          newPW: userInfo.rePassword }
      );
   
      if (response.status === 200) {
        console.log('Password reset successful');
        router.push({
          pathname: '/(routes)/login',
        });
      } else {
        setError({ errorMessage: response.data.message || 'An error occurred, please try again1.' });
      }
    } catch (error) {
      setError({ errorMessage: 'An error occurred, please try again.' });
    } finally {
      setButtonSpinner(false);
    }
  };

  return (
    <LinearGradient colors={['#E5ECF9', '#F6F7F9']} style={{ flex: 1, paddingTop: 20 }}>
      <ScrollView>
        <Image style={styles.signInImage} source={signInImage} />
        <Text style={styles1.welcomeText}>Enter new password</Text>
        <Text style={styles1.learningText}>Please enter a new password for your account: {email}</Text>

        <View style={styles1.inputContainer}>
          <View style={styles1.passwordInput}>
            <FontAwesome name="lock" size={20} color="gray" />
            <TextInput
              style={styles1.textInput}
              placeholder="New Password"
              secureTextEntry={!showNewPassword}
               value={userInfo.password}
              
              onChangeText={(value) => {
                setUserInfo({ ...userInfo, password: value });
              }}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Entypo name={showNewPassword ? 'eye-with-line' : 'eye'} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          

          <View style={styles1.passwordInput}>
            <FontAwesome name="lock" size={20} color="gray" />
            <TextInput
              style={styles1.textInput}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={userInfo.rePassword}
             
              onChangeText={(value) => {
                setUserInfo({ ...userInfo, rePassword: value });
              }}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Entypo name={showConfirmPassword ? 'eye-with-line' : 'eye'} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          {error.errorMessage && <Text style={styles1.errorText}>{error.errorMessage}</Text>}

          <TouchableOpacity
            style={styles1.submitButton}
            onPress={handleResetPassword}
            disabled={buttonSpinner}
          >
            {buttonSpinner ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles1.buttonText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles1 = StyleSheet.create({
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  learningText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#2467EC',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
