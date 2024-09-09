import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import {
  Entypo,
  FontAwesome,
  Fontisto,
  Ionicons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { CommonStyles } from '@/styles/welcome/common';
import { router } from 'expo-router';

export default function LoginScreen() { 
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });
  const [required, setRequired] = useState('');
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
  const handleSignIn = () =>{
    // router.push("/(tabs)/");
  }

  return (
    <LinearGradient colors={['#E5ECF9', '#F6F7F9']} style={{ flex: 1, paddingTop: 20 }}>
      <ScrollView>
   
        <Image style={style.signInImage} source={require('@/assets/sign-in/sign_in.png')} />


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
              <View style={CommonStyles.errorContainer}>
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
                <View style={[CommonStyles.errorContainer,{top: 145}]}>
                    <Entypo name='cross' size={18} color={"red"} />
                    <Text style={{color: "red", fontSize: 11, marginTop: -1}}>{error.password}</Text>
                </View>
            )
          }
          <TouchableOpacity
        //   onPress={() => router.push("/(routes)/forgot-password")}
          >
            <Text
            style={[ style.forgotSection]}
            >
                Forgot Password?
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
                Don't have an account?
            </Text>
            <TouchableOpacity
            onPress={() => {
                // router.push("/(routes)/sign-up")
            }}
            >
                <Text
                style={{fontSize: 18, color: "#2467Ec", marginLeft: 5}}
                >
                    Sign Up
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
  });