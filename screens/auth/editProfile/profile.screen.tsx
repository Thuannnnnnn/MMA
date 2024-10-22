import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {
  getUserInfo,
  uploadUserAvatar,
} from '@/API/editProfile/editProfileAPI';
import { UserInfo } from '@/constants/Profile/userInfo';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import defaultAvatar from '@/assets/default-avatar.png';

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user data and avatar
  const fetchUserDataAndAvatar = useCallback(async () => {
    try {
      const token = `Bearer ${await AsyncStorage.getItem('token')}`;
      const cachedUserInfo = await AsyncStorage.getItem('userInfoCache');

      // If cached data exists, set it to state
      if (cachedUserInfo) setUserInfo(JSON.parse(cachedUserInfo));

      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) throw new Error('User data not found');

      const userData = JSON.parse(userDataString);
      const { _id, avatarUrl } = userData;
      if (!_id) throw new Error('User ID not found');

      // Call API to get user info
      const profileData = await getUserInfo(_id, token);
      console.log('Using profile data from API:', profileData);

      // Update user info
      setUserInfo(profileData);

      // Update AsyncStorage with new data
      await AsyncStorage.setItem('userInfoCache', JSON.stringify(profileData));
      await AsyncStorage.setItem('user', JSON.stringify(profileData));

      // Update avatar
      if (avatarUrl) {
        console.log('Using avatar URL from user data:', avatarUrl);
        setUserAvatar(avatarUrl);
        await AsyncStorage.setItem('userAvatarCache', avatarUrl);
      } else {
        console.warn('Avatar URL not found in user data, using default avatar');
        setUserAvatar(null);
      }
    } catch (error) {
      console.error('Failed to fetch user data or avatar:', error);
      Alert.alert('Failed to load user data');
      setUserAvatar(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /// Function to pick an image from the library
const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    const selectedImage = result.assets[0];
    if (selectedImage.uri.endsWith('.png') || selectedImage.uri.endsWith('.jpg')) {
      const token = `Bearer ${await AsyncStorage.getItem('token')}`;
      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) throw new Error('User data not found');

      const userData = JSON.parse(userDataString);
      const { _id } = userData;
      if (token && _id) {
        const fetchResponse = await fetch(selectedImage.uri);
        const blob = await fetchResponse.blob();
        const file = new File([blob], `avatar.${selectedImage.uri.split('.').pop()}`, { type: selectedImage.type });
        await uploadUserAvatar(_id, file, token);
      } else {
        console.error('Token or User ID not found');
      }
    } else {
      Alert.alert('Please select a .png or .jpg image');
    }
  }
};

  
  // Fetch user data when the screen loads
  useEffect(() => {
    fetchUserDataAndAvatar();
  }, [fetchUserDataAndAvatar]);

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

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push('/(routes)/editProfile/userInfo')}
      >
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