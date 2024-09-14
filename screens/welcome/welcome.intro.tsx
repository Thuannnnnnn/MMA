import { View, Text, Image } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import AppIntroSlider from 'react-native-app-intro-slider'
import { router } from 'expo-router'
import { onboardingSwiperData } from "@/constants/constants";
import styles from '@/styles/onboarding/onboard'
import { CommonStyles } from '@/styles/welcome/common'


export default function WelcomeIntro() {
    const renderItem = ({ item }: { item: onboardingSwiperDataType }) => {
        return(
            <LinearGradient
             colors={["#E5ECF9", "#F6F7F9", "#E8EEF9"]}
             style={{flex: 1, width: '100%', height: '100%', paddingHorizontal: 16}}
             >
                <View
                style={{marginTop: 80}}
                >
                    <Image
                    source={item.image}
                    style={{alignSelf: "center", marginBottom: 100}}
                    />
                    <Text
                    style={[styles.title]}
                    >
                        {item.title}
                    </Text>
                    <View
                    style={{marginTop: 15}}
                    >
                        <Text
                        style={[styles.description]}
                        >
                            {item.description}
                        </Text>
                        <Text
                        style={[styles.description]}
                        >
                            {item.sortDescription}
                        </Text>
                        <Text
                        style={[styles.description]}
                        >
                            {item.sortDescription2}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        )
    }
    return(
       <AppIntroSlider
       
       renderItem={renderItem}
       data={onboardingSwiperData}
       onDone={() =>{
        router.push("/login")
    }}
        onSkip={() =>{
        router.push("/login")
    }}
       renderNextButton={() => (
        <View style={[styles.welcomeButtonStyle]}>
          <Text style={[styles.buttonText]}>
            Next
          </Text>
        </View>
      )}
      
      renderDoneButton={() => (
        <View style={[styles.welcomeButtonStyle]}>
          <Text style={[styles.buttonText]}>
            Done
          </Text>
        </View>
      )}
      showSkipButton={false}
      bottomButton={true}
      scrollEnabled={true}
      dotStyle={{backgroundColor:"#C6C7CC",borderRadius: 5, marginHorizontal: 5}}
      activeDotStyle={{backgroundColor: "#2467Ec",borderRadius: 5, marginHorizontal: 5}}
      
       />
    )
    
}