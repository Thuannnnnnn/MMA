import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfile, getUserInfo } from '@/API/editProfile/editProfileAPI';
import { UserInfo } from '@/constants/Profile/userInfo';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const EditProfileScreen = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    gender: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const isValidPhoneNumber = (phoneNumber: string) => /^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(phoneNumber);
  const isValidGender = (gender: string) => ['male', 'female', 'unknown'].includes(gender.toLowerCase());

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const token = `Bearer ${await AsyncStorage.getItem('token')}`;
        const userDataString = await AsyncStorage.getItem('user');
        if (!userDataString) {
          throw new Error('User data not found in AsyncStorage');
        }
    
        const userData1 = JSON.parse(userDataString);
        const _id = userData1._id;
        if (!_id) {
          throw new Error('User ID not found in user data');
        }
        const profileData = await getUserInfo(_id, token); 
        setUserInfo(profileData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleUpdateProfile = async () => {
    if (!isValidEmail(userInfo.email)) {
      Alert.alert('Invalid Input', 'Please enter a valid email address');
      return;
    }
    if (!isValidPhoneNumber(userInfo.phoneNumber)) {
      Alert.alert('Invalid Input', 'Please enter a valid phone number');
      return;
    }
    if (!isValidGender(userInfo.gender)) {
      Alert.alert('Invalid Input', 'Gender must be "male", "female", or "unknown"');
      return;
    }

    setLoading(true);
    try {
      const token = `Bearer ${await AsyncStorage.getItem('token')}`;
      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) {
        throw new Error('User data not found in AsyncStorage');
      }
  
      const userData1 = JSON.parse(userDataString);
      const _id = userData1._id;
      if (!_id) {
        throw new Error('User ID not found in user data');
      }
  
      await updateProfile(_id, userInfo, token);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={userInfo.name}
        onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={userInfo.email}
        onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
      />

      <Text style={styles.label}>Gender:</Text>
      <TextInput
        style={styles.input}
        value={userInfo.gender}
        onChangeText={(text) => setUserInfo({ ...userInfo, gender: text })}
      />

      <Text style={styles.label}>Phone Number:</Text>
      <TextInput
        style={styles.input}
        value={userInfo.phoneNumber}
        onChangeText={(text) => setUserInfo({ ...userInfo, phoneNumber: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Profile</Text>
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    color: '#000',
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
});

export default EditProfileScreen;
