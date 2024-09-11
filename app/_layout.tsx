import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import TabsLayout from './(tabs)/_layout';


export default function RootLayout() { 
  
    const [isLoggedIn] = useState(false);

    useEffect(() => {
        console.log('isLoggedIn:', isLoggedIn);
      }, [isLoggedIn]);

      return(
        <GestureHandlerRootView>
            {
                isLoggedIn ? (
                    <TabsLayout/>
                ) : (
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name='index'/>
                        <Stack.Screen name="(routes)/welcome-intro/index" />
                        <Stack.Screen name="(routes)/login/index" />
                        <Stack.Screen name="(routes)/sign-up/index" />
                    </Stack>
                )
            }
        </GestureHandlerRootView>
      )
}