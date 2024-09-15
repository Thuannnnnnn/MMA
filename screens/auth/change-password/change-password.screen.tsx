import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";
import signInImage from "@/assets/sign-in/signup.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
export default function ChangePasswordScreen() {
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    oldPW: "",
    newPW: "",
    reNewPW: "",
  });
  const [error, setError] = useState({
    message: "",
  });
  const [required] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  useEffect(() => {
    const getOtpandEmail = async () => {
      const emailUser = await AsyncStorage.getItem("email");
      setUserInfo((prevState) => ({
        ...prevState,
        email: emailUser ?? "",
      }));
    };
    getOtpandEmail();
  }, []);
  const handlePasswordValidation = (password: string, rePassword: string) => {
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordSixValue = /(?=.{6,})/;

    if (
      !passwordSpecialCharacter.test(password) ||
      !passwordSpecialCharacter.test(rePassword)
    ) {
      setError({
        ...error,
        message: "write at least one special character",
      });
      setUserInfo({ ...userInfo, newPW: "", reNewPW: "" });
      return false;
    } else if (
      !passwordOneNumber.test(password) ||
      !passwordOneNumber.test(rePassword)
    ) {
      setError({
        ...error,
        message: "write at least one number",
      });
      setUserInfo({ ...userInfo, newPW: "", reNewPW: "" });
      return false;
    } else if (
      !passwordSixValue.test(password) ||
      !passwordSixValue.test(rePassword)
    ) {
      setError({
        ...error,
        message: "write at least 6  character",
      });
      setUserInfo({ ...userInfo, newPW: "", reNewPW: "" });
      return false;
    } else if (userInfo.newPW !== userInfo.reNewPW) {
      setError({
        ...error,
        message: "Password and Repassword must same",
      });
      setUserInfo({ ...userInfo, newPW: "", reNewPW: "" });

      return false;
    }

    return true;
  };
  const handleChangePW = async () => {
    try {
      if (handlePasswordValidation(userInfo.newPW, userInfo.reNewPW)) {
        setButtonSpinner(true);
        const response = await axios.post(
          `http://192.168.1.8:8080/api/auth/changePWUser`,
          {
            email: userInfo.email,
            oldPW: userInfo.oldPW,
            newPW: userInfo.newPW,
            reNewPW: userInfo.reNewPW,
          }
        );
        if (response.status === 200) {
          //   await AsyncStorage.removeItem("email");
          //   await AsyncStorage.removeItem("otp");
          router.push({
            pathname: "/(routes)/login",
          });
        }
        setButtonSpinner(false);
      }
    } catch (error) {
      console.error("SignUp failed:", error);

      if (error instanceof AxiosError) {
        setError({
          ...error.response?.data,
        });
      } else {
        setError({
          message: "An error occurred during the registration process ...",
        });
      }

      setButtonSpinner(false);
    }
  };

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 20 }}
    >
      <ScrollView>
        <Image style={style.signInImage} source={signInImage} />

        <Text style={style.learningText}>
          Please enter your old and new passwords to change your password.
        </Text>

        <View style={[style.inputContainer]}>
          <View>
            {required && (
              <View style={style.errorContainer}>
                <Entypo name="cross" size={18} color={"red"} />
              </View>
            )}
            <View style={{ marginTop: 15 }}>
              <TextInput
                style={[style.input, { paddingLeft: 35 }]}
                keyboardType="default"
                secureTextEntry={!isPasswordVisible}
                value={userInfo.oldPW}
                placeholder="********"
                onChangeText={(value) => {
                  setUserInfo({ ...userInfo, oldPW: value });
                }}
              />

              <TouchableOpacity
                style={style.visibleIcon}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <Ionicons
                    name="eye-off-outline"
                    size={23}
                    color={"#747474"}
                  />
                ) : (
                  <Ionicons name="eye-outline" size={23} color={"#747474"} />
                )}
              </TouchableOpacity>

              <SimpleLineIcons
                style={style.icon2}
                name="lock"
                size={20}
                color={"#A1A1A1"}
              />
            </View>
            <View style={{ marginTop: 15 }}>
              <TextInput
                style={[style.input, { paddingLeft: 35 }]}
                keyboardType="default"
                secureTextEntry={!isPasswordVisible}
                value={userInfo.newPW}
                placeholder="********"
                onChangeText={(value) => {
                  setUserInfo({ ...userInfo, newPW: value });
                }}
              />

              <TouchableOpacity
                style={style.visibleIcon}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <Ionicons
                    name="eye-off-outline"
                    size={23}
                    color={"#747474"}
                  />
                ) : (
                  <Ionicons name="eye-outline" size={23} color={"#747474"} />
                )}
              </TouchableOpacity>
              {error.message && (
                <View style={[style.errorContainer, { top: 145 }]}>
                  <Entypo name="cross" size={18} color={"red"} />
                  <Text style={{ color: "red", fontSize: 11, marginTop: -1 }}>
                    {error.message}
                  </Text>
                </View>
              )}
              <SimpleLineIcons
                style={style.icon2}
                name="lock"
                size={20}
                color={"#A1A1A1"}
              />
            </View>

            <View style={{ marginTop: 15 }}>
              <TextInput
                style={[style.input, { paddingLeft: 35 }]}
                keyboardType="default"
                secureTextEntry={!isPasswordVisible}
                value={userInfo.reNewPW}
                placeholder="********"
                onChangeText={(value) => {
                  setUserInfo({ ...userInfo, reNewPW: value });
                }}
              />

              <TouchableOpacity
                style={style.visibleIcon}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <Ionicons
                    name="eye-off-outline"
                    size={23}
                    color={"#747474"}
                  />
                ) : (
                  <Ionicons name="eye-outline" size={23} color={"#747474"} />
                )}
              </TouchableOpacity>
            
              <SimpleLineIcons
                style={style.icon2}
                name="lock"
                size={20}
                color={"#A1A1A1"}
              />
            </View>
            <TouchableOpacity
              style={{
                padding: 16,
                borderRadius: 8,
                marginHorizontal: 16,
                backgroundColor: "#2467EC",
                marginTop: 50,
              }}
              onPress={handleChangePW}
            >
              {buttonSpinner ? (
                <ActivityIndicator size="small" color={"white"} />
              ) : (
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Change Password
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const style = StyleSheet.create({
  signInImage: {
    width: "60%",
    height: 190,
    alignSelf: "center",
    marginTop: 50,
  },

  learningText: {
    textAlign: "center",
    color: "#575757",
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
    backgroundColor: "white",
    color: "#A1A1A1",
  },
  visibleIcon: {
    position: "absolute",
    right: 30,
    top: 15,
  },
  icon2: {
    position: "absolute",
    left: 24,
    top: 17.8,
    marginTop: -2,
  },
  forgotSection: {
    marginHorizontal: 2,
    textAlign: "right",
    fontSize: 16,
    marginTop: 10,
    fontWeight: 600,
  },
  signUpRedirect: {
    flexDirection: "row",
    marginHorizontal: 16,
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    position: "absolute",
    top: 120, // Increase this value to prevent overlap with the button
  },
});
