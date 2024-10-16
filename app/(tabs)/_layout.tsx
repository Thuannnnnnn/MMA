import { Image, StyleSheet, BackHandler } from 'react-native';
import React, { useEffect } from 'react';
import { Tabs, useNavigation } from 'expo-router';

import houseIcon from '@/assets/icons/HouseSimple.png';
import cartIcon from '@/assets/icons/ShoppingCart.png';
import bookIcon from '@/assets/icons/BookBookmark.png';
import userIcon from '@/assets/icons/User.png';

const TabsLayout: React.FC = () => {
  const navigation = useNavigation();

  const handleBackButtonPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      BackHandler.exitApp();
    }
    return true;
  };

  useEffect(() => {
    const backAction = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonPress
    );

    return () => backAction.remove();
  }, []);

  return (
    <Tabs
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ color, focused }) => {
            let iconName;
            if (route.name === "index") {
              iconName = houseIcon;
            } else if (route.name === "cart/index") {
              iconName = cartIcon;
            } else if (route.name === "course/index") {
              iconName = bookIcon;
            } else if (route.name === "profile/index") {
              iconName = userIcon;
            }
            const iconStyle = focused
              ? {
                  width: 40,
                  height: 40,
                  padding: 5,
                }
              : { width: 25, height: 25 };

            return (
              <Image
                style={[iconStyle, { tintColor: color }]}
                source={iconName}
              />
            );
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarItemStyle: styles.tabBarItemStyle,
        };
      }}
    >
       <Tabs.Screen name="index"/>
      <Tabs.Screen name='cart/index'  options={{ headerShown: false, headerTitle: "Cart" }} />
      <Tabs.Screen name='course/index' options={{ headerShown: true, headerTitle: "Course" }} />
      <Tabs.Screen name='profile/index' options={{ headerShown: true, headerTitle: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tabBarItemStyle: {
    padding: 10,
  },
});
export default TabsLayout;