import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'

export default function profile() {
  return(
    <View>
      <Redirect href={"/(routes)/editProfile"} />
      <Text>Profile</Text>
    </View>
  )
}