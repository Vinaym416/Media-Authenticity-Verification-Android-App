import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [answer, setAnswer] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const handleSubmitEmail = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password/verify-email', {
        email
      });
      
      setSecurityQuestions(response.data.questions);
      setCurrentQuestion(response.data.questions[0]);
      setStep(2);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as any)?.response?.data?.message || 'Email verification failed';
      alert(errorMessage);
    }
  };

  const handleVerifyAnswer = () => {
    if (!answer) {
      alert('Please provide an answer');
      return;
    }
    // TODO: Verify security answer
    router.push('/ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Password Recovery</Text>

      {step === 1 ? (
        <>
          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmitEmail}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.questionText}>Security Question:</Text>
          <Text style={styles.question}>{currentQuestion}</Text>
          <TextInput
            placeholder="Your Answer"
            style={styles.input}
            value={answer}
            onChangeText={setAnswer}
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyAnswer}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
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
    backgroundColor: '#007bff',
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
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
    marginBottom: 20,
  },
});