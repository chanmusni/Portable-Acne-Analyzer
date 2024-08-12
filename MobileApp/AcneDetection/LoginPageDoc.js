import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../AcneDetection/FirebaseConfig'; // Ensure this path is correct
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase authentication method

const LoginPageDoc = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login successful
        console.log('Logged in with:', userCredential.user.email);
        navigation.navigate('Dashboard'); // Adjust as necessary for your app's flow
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password. Please try again.');
        } else if (errorCode === 'auth/user-not-found') {
          alert('User not found. Please sign up.');
        } else {
          alert(errorMessage); // Generic error message
        }
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
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="black" />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="black" />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            style={styles.input}
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

        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>Not yet Registered? <Text style={styles.signupNowText}>Signup Now</Text></Text>
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
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  backButton: {
    position: 'absolute', 
    top: 70, 
    left: 25,
    zIndex: 10,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 75,
    textAlign: 'center',
    color: '#5A5858',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    marginVertical: 10, 
    borderRadius: 10, 
    backgroundColor: '#fff',
    elevation: 3,
    marginTop: 15, 
  },
  input: {
    flex: 1,
    fontSize: 18, 
    borderWidth: 0,
    padding: 10,
    color: 'black' 
  },
  togglePasswordVisibility:{
    marginLeft: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-start',
  },
  forgotPasswordText: {
    color: 'black',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  loginButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#4fb9af',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  loginButtonText: {
    color: '#025043',
    fontSize: 22,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 5,
    
  },
  signupNowText: {
    fontWeight: 'bold',
    color: '#025043',
    fontSize: 16,
  },
});

export default LoginPageDoc;