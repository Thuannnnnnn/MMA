import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ErrorScreen() {
  const handleGoBack = () => {
    router.replace("/(tabs)/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="error" size={100} color="red" />
        <Text style={styles.title}>Payment Failed</Text>
        <Text style={styles.message}>An error occurred during the payment process. Please try again later.</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
            <Text style={styles.buttonText}>Go Back to Home</Text>
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
  goBackButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
