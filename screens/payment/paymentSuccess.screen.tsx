import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';  // Sử dụng @expo/vector-icons
import { router } from 'expo-router';

export default function SuccessScreen() {
  const handleContinue = () => {
    router.replace("/(tabs)/");
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="check-circle" size={100} color="#008DDA" />
        <Text style={styles.title}>Payment Successful</Text>
        <Text style={styles.message}>Your payment has been processed successfully. Thank you for your purchase!</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  continueButton: {
    backgroundColor: '#008DDA', // Màu xanh lá cho nút tiếp tục
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
