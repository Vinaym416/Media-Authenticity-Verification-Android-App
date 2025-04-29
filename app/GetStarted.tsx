import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function GetStarted() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/Login'); // Changed to lowercase for consistency
  };

  const handleLogin = () => {
    router.push('/Login'); // Changed to lowercase for consistency
  };

  const handleRegister = () => {
    router.push('/Register'); // Changed to lowercase for consistency
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleLogin}>
          <Text style={styles.headerButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleRegister}>
          <Text style={styles.headerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require('E:\\Media app\\deepfake-detector-app\\Frontend\\assets\\images\\051262e4-d440-4987-966f-0f48bba07fc0.avif')}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Fake Image Detector</Text>
        <Text style={styles.subtitle}>
          Detect manipulated or fake images with AI-powered technology. Fast, accurate, and secure.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  headerButton: {
    marginLeft: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  headerButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
  },
  heroImage: {
    width: '100%',
    height: '55%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
