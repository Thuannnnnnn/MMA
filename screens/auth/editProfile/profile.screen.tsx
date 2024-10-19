import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { getUserInfo, getUserAvatar, uploadUserAvatar, updateUserAvatar } from '@/API/editProfile/editProfileAPI';
import { UserInfo } from '@/constants/Profile/userInfo';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import defaultAvatar from '@/assets/default-avatar.png';

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const token = `Bearer ${await AsyncStorage.getItem('token')}`;
      const cachedUserInfo = await AsyncStorage.getItem('userInfoCache');

      if (cachedUserInfo) {
        setUserInfo(JSON.parse(cachedUserInfo));
      }

      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) {
        throw new Error('User data not found in AsyncStorage');
      }

      const userData = JSON.parse(userDataString);
      const _id = userData._id;
      if (!_id) {
        throw new Error('User ID not found in user data');
      }

      const profileData = await getUserInfo(_id, token);
      setUserInfo(profileData);
      await AsyncStorage.setItem('userInfoCache', JSON.stringify(profileData));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      Alert.alert('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserAvatar = useCallback(async () => {
    try {
      const token = `Bearer ${await AsyncStorage.getItem('token')}`;
      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) {
        throw new Error('User data not found in AsyncStorage');
      }

      const userData = JSON.parse(userDataString);
      const _id = userData._id;
      if (!_id) {
        throw new Error('User ID not found in user data');
      }

      const avatarData = await getUserAvatar(_id, token);
      if (avatarData?.avatarUrl) {
        setUserAvatar(avatarData.avatarUrl);
        await AsyncStorage.setItem('userAvatarCache', avatarData.avatarUrl);
      }
    } catch (error) {
      console.error('Failed to fetch user avatar:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchUserAvatar();
  }, [fetchUserData, fetchUserAvatar]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      const response = await fetch(selectedImageUri);
      const blob = await response.blob();
      const selectedImageFile = new File([blob], 'avatar.png', { type: 'image/png' });

      try {
        const token = `Bearer ${await AsyncStorage.getItem('token')}`;
        const userDataString = await AsyncStorage.getItem('user');
        if (!userDataString) {
          throw new Error('User data not found in AsyncStorage');
        }

        const userData = JSON.parse(userDataString);
        const _id = userData._id;

        if (userAvatar) {
          await updateUserAvatar(_id, selectedImageFile, token);
          Alert.alert('Avatar updated successfully!');
        } else {
          await uploadUserAvatar(_id, selectedImageFile, token);
          Alert.alert('Avatar uploaded successfully!');
        }

        setUserAvatar(selectedImageUri);
      } catch (error) {
        console.error('Failed to upload/update avatar:', error);
        Alert.alert('Failed to upload/update avatar');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load user data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={userAvatar ? { uri: userAvatar } : defaultAvatar}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.userName}>{userInfo.name}</Text>
      </View>

      <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/(routes)/editProfile/userInfo")}>
        <Text style={styles.menuText}>Edit Account</Text>
        <Ionicons name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>Settings and Privacy</Text>
        <Ionicons name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>Help</Text>
        <Ionicons name="chevron-forward" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderColor: '#000000',
    borderWidth: 1,
  },
  userName: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
  },
  menuText: {
    color: '#000000',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;
