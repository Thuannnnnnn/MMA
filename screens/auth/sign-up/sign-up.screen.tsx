import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import {
  Entypo,
  FontAwesome,
  Fontisto,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import signInImage from '@/assets/sign-in/signup.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { sendOtpRegister } from '@/API/SignUp/SignUpApi';
export default function SignUpScreen() {
  const [buttonSpinner, setButtonSpinner ] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: '',
  });
  const [error,setError] = useState({
    message: ''
  })
  const [required] = useState('');
  const handleSignUp = async () => {
    try {
      setButtonSpinner(true);
     await sendOtpRegister({ email: userInfo.email });
        router.push({
          pathname: '/(routes)/sign-up/otp',
        });
        await AsyncStorage.setItem('email', userInfo.email);
      setButtonSpinner(false);
    } catch (error) {
      console.error('SignUp failed:',error);
  
      if (error instanceof AxiosError) {
        setError({
          ...error.response?.data,
        });
      } else {
        setError({
          message: 'An error occurred during the registration process ...',
        });
      }
  
      setButtonSpinner(false);
    }
  };

  return (
    <LinearGradient colors={['#E5ECF9', '#F6F7F9']} style={{ flex: 1, paddingTop: 20 }}>
      <ScrollView>
   
      <Image style={style.signInImage} source={signInImage} />


        <Text style={style.welcomeText}>Welcome</Text>
        <Text style={style.learningText}>Please enter your email to register a new account</Text>


        <View style={[style.inputContainer]}>
          <View>
  
            <TextInput
              style={[style.input, { paddingLeft: 35 }]}
              keyboardType="email-address"
              value={userInfo.email}
              placeholder="Please enter your Email"
              onChangeText={(value) => setUserInfo({ ...userInfo, email: value })}
            />
     
            <Fontisto style={{ position: 'absolute', left: 26, top: 17.8 }} name="email" size={20} color={'#A1A1A1'} />
         
            {required && (
              <View style={style.errorContainer}>
                <Entypo name="cross" size={18} color={'red'} />
              </View>
            )}
          <TouchableOpacity
          style={{
            padding: 16,
            borderRadius: 8,
            marginHorizontal: 16,
            backgroundColor: "#2467EC",
            marginTop: 30
          }}
          onPress={handleSignUp}
          >
            {
                buttonSpinner ?(
                   <ActivityIndicator
                   size="small" color={"white"}
                   />
                ):(
                    <Text
                    style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight: 600
                    }}
                    >
                        Sign Up
                    </Text>
                )
            }
          </TouchableOpacity>


          <View style={style.signUpRedirect}>
            <Text style={{fontSize: 18}}>
                You have an account?
            </Text>
            <TouchableOpacity
            onPress={() => {
                 router.push("/(routes)/login")
            }}
            >
                <Text
                style={{fontSize: 18, color: "#2467Ec", marginLeft: 5}}
                >
                    Login
                </Text>

            </TouchableOpacity>

          </View>
        

          <TouchableOpacity>
          <View
          style={{
            padding: 16,
            borderRadius: 8,
            marginHorizontal: 16,
            backgroundColor: "white",
            marginTop: 10,
            borderColor: "black",
            borderWidth: 1,       
        }}
          >
            <Text
                style={{
                        color: "black",
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight: 600
                    }}
                    >
                        
            <FontAwesome
            name='google' size={24}
            />
            continue with google
            </Text>
          </View>
          </TouchableOpacity>
          </View>
          <View>
          <Text style={{marginTop: 10, color: 'red', fontSize:20, fontWeight: 600}}>{error.message}</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}



const style = StyleSheet.create({

    signInImage: {
      width: '60%',
      height: 190,
      alignSelf: 'center',
      marginTop: 50,
    },
  
    welcomeText: {
      textAlign: 'center',
      fontSize: 24,
    },
   
    learningText: {
      textAlign: 'center',
      color: '#575757',
      fontSize: 15,
      marginTop: 10,
    },
  
    inputContainer: {
      marginHorizontal: 16,
      marginTop: 20,
      rowGap: 30,
      borderTopLeftRadius: 10,
    },
  
    input: {
      height: 55,
      marginHorizontal: 16,
      borderRadius: 8,
      paddingLeft: 35,
      fontSize: 16,
      backgroundColor: 'white',
      color: '#A1A1A1',
    },
    visibleIcon: {
      position: "absolute",
      right: 30,
      top: 15
    },
    icon2:{
      position: "absolute",
      left: 24,
      top: 17.8,
      marginTop: -2
    },
    forgotSection:{
      marginHorizontal: 2,
      textAlign: "right",
      fontSize: 16,
      marginTop: 10,
      fontWeight: 600
    },
    signUpRedirect: {
      flexDirection: "row",
      marginHorizontal: 16,
      justifyContent: "center",
      marginBottom: 10,
      marginTop: 10
    },
    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 16,
      position: "absolute",
      top: 60,
    },
  });
