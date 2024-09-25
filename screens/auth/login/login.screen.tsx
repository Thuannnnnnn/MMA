import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Entypo,
  FontAwesome,
  Fontisto,
  Ionicons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import SignInPng from '@/assets/sign-in/sign_in.png';
import * as WebBrowser from 'expo-web-browser';
import { useAuth, useOAuth, useUser } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import axios, { AxiosError } from 'axios';

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() { 
  // sign gg
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google"})
  const {user}= useUser();
  const {isSignedIn} = useAuth();

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/home", { scheme: "myapp" }),
      });
  
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        return null;
      }
    } catch (error) {
      console.error("OAuth Error:", error);
    }
  }, [startOAuthFlow]);

 
  useEffect(() => {
    if(isSignedIn){
      router.push("/(routes)/onboarding")
    }
  }, [isSignedIn, router])
  useEffect(() => {
    if(user) {
      loginGoogle();
    }
  }, [user]);
  const loginGoogle = async() => {
    try {
      if(user) {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/auth/login/withGoogle`, {
          email: user.emailAddresses?.toString(),
          name: user.fullName?.toString()
        });

        if(response.status == 200) {
          console.log(response.data);
          // router.push("/(routes)/home");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  // sign tranditional

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner ] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });
  const [required] = useState('');
  const [error,setError] = useState({
    password: "",
  })
  const handlePasswordValidation = (value: string) => {
    const password = value;
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordSixValue = /(?=.{6,})/;

    if(!passwordSpecialCharacter.test(password)) {
        setError({
            ...error,
            password: "write at least one special character"
        });
        setUserInfo({... userInfo, password: ""})
    }else if(!passwordOneNumber.test(password)){
        setError({
            ...error,
            password: "write at least one number"
        })
    }else if(!passwordSixValue.test(password)){
        setError({
            ...error,
            password: "write at least 6  character"
        })
    }else{
        setUserInfo({
            ... userInfo,
            password: ""
        })
    }
  };
  const handleSignIn = async () => {
    try {
      setButtonSpinner(true);
  
      const response = await axios.post(`${process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}/api/auth/login/base`, {
        email: userInfo.email,
        password: userInfo.password,
      });
  
      console.log('Login successful:', response.data);

      router.replace("/(tabs)/");

      setButtonSpinner(false);
    } catch (error) {
      console.error('Login failed:',error);
  
      if (error instanceof AxiosError) {
        setError({
          ...error.response?.data,
          password: 'Login failed. Please try again.',
        });
      } else {
        setError({
          password: 'An unexpected error occurred. Please try again.',
        });
      }
  
      setButtonSpinner(false);
    }
  };
  return (
    <LinearGradient colors={['#E5ECF9', '#F6F7F9']} style={{ flex: 1, paddingTop: 20 }}>
      <ScrollView>
   
        <Image style={style.signInImage} source={SignInPng} />


        <Text style={style.welcomeText}>Welcome Back!</Text>
        <Text style={style.learningText}>Login to your existing account of Tung dep zai</Text>


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
          
          <View style={{ marginTop: 15 }}>
      
            <TextInput
              style={[style.input, { paddingLeft: 35 }]}
              keyboardType="default"
              secureTextEntry={!isPasswordVisible}
              value={userInfo.password}
              placeholder="********"
              onChangeText={(value) => {
                handlePasswordValidation(value);
                setUserInfo({ ...userInfo, password: value });
              }}
            />

            <TouchableOpacity
            style={style.visibleIcon}
            onPress={()  => setPasswordVisible(!isPasswordVisible)}
            >
                {
                    isPasswordVisible ?(
                        <Ionicons
                        name='eye-off-outline'
                        size={23}
                        color={"#747474"}
                        />
                    ):(
                        <Ionicons
                        name='eye-outline'
                        size={23}
                        color={"#747474"}
                        />
                    )
                }
            </TouchableOpacity>

            <SimpleLineIcons
            style={style.icon2}
            name='lock'
            size={20}
            color={"#A1A1A1"}
            />
          </View>
          {
            error.password &&(
                <View style={[style.errorContainer,{top: 145}]}>
                    <Entypo name='cross' size={18} color={"red"} />
                    <Text style={{color: "red", fontSize: 11, marginTop: -1}}>{error.password}</Text>
                </View>
            )
          }
          <TouchableOpacity
       onPress={() => router.push("/(routes)/forgotPassword")}
          >
            <Text
            style={[ style.forgotSection]}
            >
                Forgot Password?
            </Text>
          </TouchableOpacity>
          {
            error.password &&(
                <View style={[style.errorContainer,{top: 145}]}>
                    <Entypo name='cross' size={18} color={"red"} />
                    <Text style={{color: "red", fontSize: 11, marginTop: -1}}>{error.password}</Text>
                </View>
            )
          }
          <TouchableOpacity
        onPress={() => router.push("/(routes)/content/content-list")}
          >
            <Text
            style={[ style.forgotSection]}
            >
                content-video
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
          style={{
            padding: 16,
            borderRadius: 8,
            marginHorizontal: 16,
            backgroundColor: "#2467EC",
            marginTop: 10
          }}
          onPress={handleSignIn}
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
                        Sign In
                    </Text>
                )
            }
          </TouchableOpacity>


          <View style={style.signUpRedirect}>
            <Text style={{fontSize: 18}}>
            Don&apos;t have an account?
            </Text>
            <TouchableOpacity
            onPress={() => {
                 router.push("/(routes)/sign-up")
            }}
            >
                <Text
                style={{fontSize: 18, color: "#2467Ec", marginLeft: 5}}
                >
                    Sign Up
                </Text>

            </TouchableOpacity>

          </View>
        

          <TouchableOpacity onPress={onPress}>
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