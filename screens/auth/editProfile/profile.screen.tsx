import React, {useState, useCallback } from 'react';
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
  updateUserAvatar,
} from '@/API/editProfile/editProfileAPI';
import { UserInfo } from '@/constants/Profile/userInfo';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import defaultAvatar from '@/assets/default-avatar.png';

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hàm chuyển đổi Blob sang Base64
  const blobToBase64 = (blob: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Hàm lấy dữ liệu người dùng và avatar
  const fetchUserDataAndAvatar = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const authToken = `Bearer ${token}`;
      const cachedUserInfo = await AsyncStorage.getItem('userInfoCache');

      // Nếu có cache thì sử dụng
      if (cachedUserInfo) setUserInfo(JSON.parse(cachedUserInfo));

      const userDataString = await AsyncStorage.getItem('user');
      if (!userDataString) throw new Error('User data not found');

      const userData = JSON.parse(userDataString);
      const { _id, avatarUrl } = userData;
      if (!_id) throw new Error('User ID not found');

      // Gọi API để lấy thông tin người dùng
      const profileData = await getUserInfo(_id, authToken);
      setUserInfo(profileData);

      // Lưu lại thông tin mới vào AsyncStorage
      await AsyncStorage.setItem('userInfoCache', JSON.stringify(profileData));
      await AsyncStorage.setItem('user', JSON.stringify(profileData));

      // Cập nhật avatar
      if (avatarUrl) {
        setUserAvatar(avatarUrl);
        await AsyncStorage.setItem('userAvatarCache', avatarUrl);
      } else {
        setUserAvatar(null);
      }
    } catch (error) {
      console.error('Failed to fetch user data or avatar:', error);
      Alert.alert('Error', 'Failed to load user data');
      setUserAvatar(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setLoading(true);
        const selectedImage = result.assets[0];
        const fileExtension = selectedImage.uri.split('.').pop();
        if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
          const token = await AsyncStorage.getItem('token');
          const authToken = `Bearer ${token}`;
          const userDataString = await AsyncStorage.getItem('user');
          if (!userDataString) throw new Error('User data not found');

          const userData = JSON.parse(userDataString);
          const { _id, avatarUrl } = userData;

          if (authToken && _id) {
            // Chuyển đổi ảnh sang Base64
            const response = await fetch(selectedImage.uri);
            const blob = await response.blob();
            const base64data = await blobToBase64(blob);

            if (typeof base64data === 'string') {
              let apiResponse;

              // Xác định API để tải lên hoặc cập nhật avatar
              if (!avatarUrl) {
                apiResponse = await uploadUserAvatar(_id, base64data, authToken);
              } else {
                apiResponse = await updateUserAvatar(_id, base64data, authToken);
              }

              if (apiResponse.fileUrl) {
                setUserAvatar(apiResponse.fileUrl);
                await AsyncStorage.setItem('userAvatarCache', apiResponse.fileUrl);

                // Cập nhật user info trong AsyncStorage
                const updatedUserData = { ...userData, avatarUrl: apiResponse.fileUrl };
                await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));

                Alert.alert('Success', avatarUrl ? 'Avatar updated successfully' : 'Avatar uploaded successfully');
              } else {
                Alert.alert('Error', 'Failed to update avatar URL');
              }
            } else {
              Alert.alert('Error', 'Failed to convert image to Base64');
            }
          } else {
            console.error('Token or User ID not found');
          }
        } else {
          Alert.alert('Invalid Image', 'Please select a JPEG or PNG image');
        }
      }
    } catch (error) {
      console.error('Error picking or uploading image:', error);
      Alert.alert('Error', 'Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  // Lấy dữ liệu khi screen load
  useFocusEffect(
    useCallback(() => {
      fetchUserDataAndAvatar();
    }, [fetchUserDataAndAvatar])
  );

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
            source={userAvatar? { uri: `${userAvatar}?timestamp=${new Date().getTime()}` }: defaultAvatar}
            style={styles.avatar}
            resizeMode="cover"
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
