import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserInfo } from '@/API/editProfile/editProfileAPI';
import { UserInfo } from '@/constants/Profile/userInfo';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const UserInfoScreen = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
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
        <Text style={styles.errorText}>Failed to load user information</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(routes)/editProfile')} style={styles.backButton}> 
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Information</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <FontAwesome name="user" size={20} color="#000" style={styles.icon} />
          <View>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{userInfo.name}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={20} color="#000" style={styles.icon} />
          <View>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userInfo.email}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome name="venus-mars" size={20} color="#000" style={styles.icon} />
          <View>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{userInfo.gender}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <AntDesign name="phone" size={20} color="#000" style={styles.icon} />
          <View>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{userInfo.phoneNumber}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/(routes)/editProfile/editUserInfo")}>
        <Text style={styles.menuText}>Edit Information</Text>
        <AntDesign name="right" size={20} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/(routes)/editProfile/editUserPassword")}>
        <Text style={styles.menuText}>Edit Password</Text>
        <AntDesign name="right" size={20} color="#000" />
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
  infoContainer: {
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    color: '#333',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  menuText: {
    color: '#000',
    fontSize: 16,
  },
});

export default UserInfoScreen;
