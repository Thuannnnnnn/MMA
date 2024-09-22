import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import styles from '@/styles/onboarding/onboard'

export default function OnBoardingScreen() { 
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if(countdown != null && countdown > 0){
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }else if (countdown === 0) {
            router.push("/(routes)/welcome-intro")
        }
        return () => clearTimeout(timer);
    }, [countdown])

    return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <View>
            
        <View>
                <Image
                source={require("@/assets/logo.png")}
                style={styles.logo}
                />
                <Image
                source={require("@/assets/onboarding/shape_9.png")}
                />
            </View>
            <View style={styles.titleWrapper}>
                <Image
                style={styles.titleTextShape1}
                source={require("@/assets/onboarding/shape_3.png")}
                />
                <Text style={[styles.titleText]}>
                    Start Learning With
                </Text>
                <Image
                style={styles.titleTextShape2}
                source={require("@/assets/onboarding/shape_2.png")}
                />
            </View>
            <View>
                <Image
                style={styles.titleTextShape3}
                source={require("@/assets/onboarding/shape_6.png")}
                />

                <Text style={[styles.titleText]}>
                    RedFlag GoldenStar
                </Text>
            </View>
            <View style={[styles.dscpWrapper]}>
                <Text style={[styles.dscpText]}>
                    Explore a variety of interraction lesson
                </Text>
                <Text style={[styles.dscpText]}>
                    Video, quizze & assigment.
                </Text>
            </View>
        </View>
    </LinearGradient>
    )
}