import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { updatePassword } from '@/API/editProfile/editProfileAPI';
import { router } from 'expo-router';

const EditPasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 6;

    if (!isLongEnough) {
      setErrorMessage('Password must be at least 6 characters long.');
      return false;
    }
    if (!hasUpperCase) {
      setErrorMessage('Password must contain at least one uppercase letter.');
      return false;
    }
    if (!hasSpecialChar) {
      setErrorMessage('Password must contain at least one special character.');
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!validatePassword(newPassword)) {
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) {
        throw new Error('User data not found in AsyncStorage');
      }
  
      const userData = JSON.parse(userDataString);
      const userId = userData._id;
      if (!userId) {
        throw new Error('User ID not found in user data');
      }

      const passwordData = {
        oldPassword,
        newPassword,
        reNewPassword: confirmNewPassword,
      };

      await updatePassword(userId, passwordData, `Bearer ${token}`);
      
      setSuccessMessage('Password updated successfully.');
      setSuccess(true);
      setErrorMessage('');
    } catch (error) {
      console.error('Failed to change password:', error);
      setErrorMessage('Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(routes)/editProfile/userInfo")} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
      </View>

      <Text style={styles.label}>Old Password:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={!showOldPassword}
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowOldPassword(!showOldPassword)}
        >
          <Entypo name={showOldPassword ? 'eye-with-line' : 'eye'} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>New Password:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowNewPassword(!showNewPassword)}
        >
          <Entypo name={showNewPassword ? 'eye-with-line' : 'eye'} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirm New Password:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={!showConfirmNewPassword}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
        >
          <Entypo name={showConfirmNewPassword ? 'eye-with-line' : 'eye'} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Change Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  headerTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#000',
    paddingRight: 40,
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  button: {
    backgroundColor: '#2467EC',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: 'green', 
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default EditPasswordScreen;
