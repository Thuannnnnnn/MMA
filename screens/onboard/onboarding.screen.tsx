import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import styles from '@/styles/onboarding/onboard';

export default function OnBoardingScreen() {
    const router = useRouter();
    const text = 'RedFlag GoldenStar';
    const redFlagIndex = 7;
    const animatedValues = text.split('').map(() => useRef(new Animated.Value(0)).current);

    useEffect(() => {
        const animations = animatedValues.map((animatedValue, index) => {
            const toValue = index < redFlagIndex ? 1 : 2;
            return Animated.timing(animatedValue, {
                toValue,
                duration: 50,
                useNativeDriver: false,
            });
        });

        Animated.sequence(animations).start(() => {
            router.push("/(routes)/welcome-intro");
        });
    }, [animatedValues, router]);

    const getColor = (index: number) => {
        return animatedValues[index].interpolate({
            inputRange: [0, 1, 2],
            outputRange: ['#000', '#ff0000', '#f8aa1a'],
        });
    };

    return (
        <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
                    <Text style={styles.titleText}>
                        {text.split('').map((char, index) => (
                            <Animated.Text key={index} style={{ color: getColor(index) }}>
                                {char}
                            </Animated.Text>
                        ))}
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
    );
}
