import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../AcneDetection/FirebaseConfig'; // Make sure the path to your Firebase config is correct
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignupPage = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignUp = () => {
    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User registration successful
        console.log('User registered:', userCredential.user);
        navigation.navigate('Dashboard'); // Adjust as necessary for your app's flow
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#c0f2f3', '#b1dbdb', '#48cbc5', '#1e9c99']}
        style={styles.gradient}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            style={styles.passwordInput}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.togglePasswordVisibility}
          >
            <Ionicons
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSignUp} style={styles.createAccountButton}>
          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
  Already have an account?{' '}
  <Text style={{ fontWeight: 'bold' }}>Login</Text>
</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'auto',
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#5A5858',
    marginTop: 100,
  },
  input: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    marginVertical: 10,
    width: '80%',
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 18,
    backgroundColor: 'white',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    marginVertical: 10,
    width: '80%',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  togglePasswordVisibility: {
    marginRight: 10,
  },
  createAccountButton: {
    backgroundColor: '#4fb9af',
    width: '80%',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 10,
  },
  createAccountButtonText: {
    color: '#025043',
    fontSize: 22,
    fontWeight: 'bold',
  },
  loginText: {
    marginVertical: 10,
    fontSize: 16,
    marginRight: 90,
    color: '#025043',
  },
  loginLink: {
    fontWeight: 'bold',
    color: '#025043',
    fontSize: 16,
  },
  orText: {
    marginVertical: 10,
    fontSize: 18,
    color: '#025043',
  },
  socialButton: {
    width: '80%',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 5,
    backgroundColor: 'white',
  },
  socialButtonText: {
    color: '#5A5858',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute', 
    top: 70, 
    left: 25,
    zIndex: 10,
  },
});

export default SignupPage;