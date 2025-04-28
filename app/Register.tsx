import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion1, setSecurityQuestion1] = useState('');
  const [securityQuestion2, setSecurityQuestion2] = useState('');
  const [securityQuestion3, setSecurityQuestion3] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !answer1 || !answer2 || !answer3) {
      alert('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const securityQuestions = [
        { question: "What is your mother's maiden name?", answer: answer1 },
        { question: "What was your first pet's name?", answer: answer2 },
        { question: "In which city were you born?", answer: answer3 }
      ];

      await axios.post('http://localhost:5000/api/register', {
        email,
        password,
        securityQuestions
      });

      alert('Registration successful');
      router.push('/Login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Registration failed');
      } else {
        alert('Registration failed');
      }
    }
  };

  const goToLogin = () => {
    router.push('/Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          placeholder="Confirm Password"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Text style={styles.sectionTitle}>Security Questions</Text>

        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>What is your mother's maiden name?</Text>
          <TextInput
            placeholder="Your Answer"
            style={styles.input}
            value={answer1}
            onChangeText={setAnswer1}
          />
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>What was your first pet's name?</Text>
          <TextInput
            placeholder="Your Answer"
            style={styles.input}
            value={answer2}
            onChangeText={setAnswer2}
          />
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>In which city were you born?</Text>
          <TextInput
            placeholder="Your Answer"
            style={styles.input}
            value={answer3}
            onChangeText={setAnswer3}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    color: '#007bff',
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  questionContainer: {
    width: '100%',
    marginBottom: 15,
  },
  questionLabel: {
    fontSize: 16,
    marginBottom: 5,
  }
});
