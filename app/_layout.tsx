import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import TabsLayout from "./(tabs)/_layout";
import { ClerkProvider } from "@clerk/clerk-expo";

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  const [isLoggedIn] = useState(false);

  useEffect(() => {
    console.log("isLoggedIn:", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <GestureHandlerRootView>
      {isLoggedIn ? (
        <TabsLayout />
      ) : (
        <ClerkProvider publishableKey={publishableKey}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(routes)/welcome-intro/index" />
            <Stack.Screen name="(routes)/login/index" />
            <Stack.Screen name="(routes)/sign-up/index" />
            <Stack.Screen name="(routes)/sign-up/otp" />
            <Stack.Screen name="(routes)/sign-up/info" />
            <Stack.Screen name="(routes)/change-password/index" />
            <Stack.Screen name="(routes)/forgotPassword/index" />
            <Stack.Screen name="(routes)/forgotPassword/inputOTP" />
            <Stack.Screen name="(routes)/forgotPassword/newPassword" />
            <Stack.Screen name="(routes)/cart/index" />
          </Stack>
        </ClerkProvider>
      )}
    </GestureHandlerRootView>
  );
}
