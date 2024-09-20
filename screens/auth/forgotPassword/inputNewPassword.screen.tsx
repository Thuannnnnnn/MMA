import { View, Text,Image, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome, Entypo } from '@expo/vector-icons'; // Importing icons
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import signInImage from '@/assets/sign-in/signup.png';
import { styles } from '@/styles/forgotPassword/forgotPassword';
import { router } from 'expo-router';

export default function InputNewPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle confirm password visibility
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [error, setError] = useState('');

  
  const route = useRoute();
  const { email } = route.params as { email: string };

  const handleResetPassword = async () => {
    try {
      setButtonSpinner(true);
      setError('');

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        setButtonSpinner(false);
        return;
      }

      
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/auth/change-password`,
        { email, newPassword }
      );

      if (response.status === 200) {
        console.log('Password reset successful');
        router.push({
          pathname: '/(routes)/login',
          
        });
      } else {
        setError('Password reset failed. Please try again.');
      }
    } catch (error) {
      setError('A connection error occurred. Please check your network.');
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
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Entypo name={showNewPassword ? "eye-with-line" : "eye"} size={20} color="gray" />
            </TouchableOpacity>
          </View>

  
          <View style={styles1.passwordInput}>
            <FontAwesome name="lock" size={20} color="gray" />
            <TextInput
              style={styles1.textInput}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Entypo name={showConfirmPassword ? "eye-with-line" : "eye"} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          {error && <Text style={styles1.errorText}>{error}</Text>}

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
