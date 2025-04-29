import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<{
    prediction: number;
    confidence: number;
    heatmap?: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // You can implement your auth check logic here
        // For example, checking if there's a valid token in storage
        const token = await AsyncStorage.getItem('userToken');
        setIsAuthenticated(!!token);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect to GetStarted if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/GetStarted" />;
  }

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedUri = result.assets[0].uri;
        setImage(pickedUri);
        setResult(null); // clear previous results
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Could not pick image. Please try again.');
    }
  };

  const processImage = async () => {
    if (!image) {
      Alert.alert('No image selected', 'Please select an image first.');
      return;
    }

    try {
      setIsProcessing(true);

      const formData = new FormData();
      const fileName = image.split('/').pop() || 'photo.jpg';
      const response = await fetch(image);
      const blob = await response.blob();

      formData.append('image', blob);

      const uploadResponse = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(data.error || 'Processing failed.');
      }

      setResult(data);
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to process image.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Fake Image Detector</Text>

        <Button title="Pick an Image" onPress={pickImage} />

        {image && (
          <View style={styles.imageContainer}>
            <Text style={styles.label}>Original Image:</Text>
            <Image source={{ uri: image }} style={styles.image} />
            <Button
              title={isProcessing ? 'Processing...' : 'Check Image'}
              onPress={processImage}
              disabled={isProcessing}
            />
            {isProcessing && <ActivityIndicator style={{ marginTop: 10 }} size="large" color="#0000ff" />}
          </View>
        )}

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              Prediction: <Text style={styles.boldText}>{result.prediction === 0 ? 'Real' : 'Fake'}</Text>
            </Text>
            <Text style={styles.resultText}>
              Confidence: <Text style={styles.boldText}>{result.confidence.toFixed(2)}%</Text>
            </Text>

            {result.heatmap && (
              <View style={styles.heatmapContainer}>
                <Text style={styles.label}>Detected Manipulated Areas:</Text>
                <Image
                  source={{ uri: `data:image/jpeg;base64,${result.heatmap}` }}
                  style={styles.heatmapImage}
                  resizeMode="contain"
                />
                <Text style={styles.heatmapNote}>Red areas indicate potential manipulation.</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f2f2f2',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultContainer: {
    marginTop: 30,
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  resultText: {
    fontSize: 18,
    marginVertical: 5,
    color: '#444',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
  heatmapContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  heatmapImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  heatmapNote: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
});
