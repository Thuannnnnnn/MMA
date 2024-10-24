import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import {
  Entypo,
  FontAwesome,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import signInImage from '@/assets/sign-in/signup.png';
import { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OtpInput } from 'react-native-otp-entry';
import { validateOtp } from '@/API/SignUp/SignUpApi';
export default function OtpSignUpScreen ()  {
  const [buttonSpinner, setButtonSpinner ] = useState(false);
  const [userInfo, setUserInfo] = useState({
    otp: '',
    email:'',
  });
  const [error,setError] = useState({
    message: ''
  })
  const [required] = useState('');

  const handleOtpChange = async (otp: string) => {
    const emailUser = await AsyncStorage.getItem('email');
    setUserInfo({
      ...userInfo,
      otp: otp,
      email: emailUser?? '',
    });
  };
  const handleSignUp = async () => {
    try {     
      setButtonSpinner(true);
      await validateOtp({email: userInfo.email, otpCode: userInfo.otp });
        await AsyncStorage.setItem('otpCode', userInfo.otp);
        router.push({
          pathname: '/(routes)/sign-up/info',
        });
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
        <Text style={style.learningText}>Enter Your Verification Code</Text>


        <View style={[style.inputContainer]}>
          <View>
  
          <OtpInput
              numberOfDigits={4}
              onTextChange={handleOtpChange}
              focusColor={'#2467EC'}
              focusStickBlinkingDuration={400}
              theme={{
                pinCodeContainerStyle: {
                  backgroundColor: '#fff',
                  width: 58,
                  height: 58,
                  borderRadius: 12,
                },
              }}
            />
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

