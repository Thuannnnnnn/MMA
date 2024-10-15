import { Stack } from "expo-router";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import TabsLayout from "./(tabs)/_layout";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  const [isLoggedIn] = useState(false);
      return(
        <GestureHandlerRootView>
            {
                isLoggedIn ? (
                    <TabsLayout/>
                ) : (
                    <ClerkProvider publishableKey={publishableKey}>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name='index'/>
                        <Stack.Screen name="(routes)/welcome-intro/index" />
                        <Stack.Screen name="(routes)/login/index" />
                        <Stack.Screen name="(routes)/sign-up/index" />
                        <Stack.Screen name="(routes)/sign-up/otp" />
                        <Stack.Screen name="(routes)/sign-up/info" />
                        <Stack.Screen name="(routes)/change-password/index" />
                        <Stack.Screen name="(routes)/content/content-list" />
                        <Stack.Screen name="(routes)/content/content-video" />
                        <Stack.Screen name="(routes)/forgotPassword/index" />
                        <Stack.Screen name="(routes)/forgotPassword/inputOTP" />
                        <Stack.Screen name="(routes)/forgotPassword/newPassword" />
                        <Stack.Screen name="(routes)/payment/index" />
                        <Stack.Screen name="(routes)/payment/paymentSuccess" />
                        <Stack.Screen name="(routes)/payment/paymentError" />
                        <Stack.Screen name="(routes)/cart/index" />
                        <Stack.Screen name="(routes)/quizz/index" />
                        <Stack.Screen name="(routes)/quizz/quizzSuccess" />
                        <Stack.Screen 
                name="(routes)/quizz/quizzResults" 
                options={({ navigation }) => ({
                  headerShown: true, 
                  headerTitle: () => (
                    <View style={{ flex: 1, marginLeft: 30 }}>
                      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Quizz Results</Text>
                    </View>
                  ),
                  headerBackVisible: false,
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.navigate("(routes)/content/content-list")}style={{ marginLeft: 10 }}>
                       <Icon name="arrow-back" size={28} color="black" />
                    </TouchableOpacity>
                  ),
                })}
              />
                        <Stack.Screen name="(routes)/courseDetails/index" options={{ headerShown: true, title: "Course Details", headerBackTitle: "Back" }} />

                    </Stack>
                    </ClerkProvider>
                )
            }
        </GestureHandlerRootView>
      )
}
