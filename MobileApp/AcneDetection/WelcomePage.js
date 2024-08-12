import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const WelcomePage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ffffff','#c0f2f3', '#b1dbdb', '#48cbc5', '#1e9c99']}
        style={styles.gradient}
      >
        <Image
          source={require('./assets/Logoacne.png')}
          style={styles.logo}
        />
        <Text style={styles.welcomeBack}>Welcome Back User!</Text>
        <Text style={styles.slogan}>Healthier Skin, Happier You</Text>

        <View style={styles.connectContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {
            console.log('Login button clicked'); 
            navigation.navigate('LoginPageDoc'); 
          }}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button1} onPress={() => {
            console.log('Sign up button clicked'); 
            navigation.navigate('Signup'); 
          }}>
            <Text style={styles.buttonText1}>Create an Account</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  topButtons: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
  },
  topButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginTop: 90,
    marginBottom: 40,
  },
  welcomeBack: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  slogan: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  connectContainer: {
    width: '100%',
    paddingHorizontal: 40,
    
  },
  connectWith: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    fontWeight: 'semibold'
  },
  input: {
    height: 60,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: 'center',
    backgroundColor: '#FFDBD5',
    fontSize: 18,
    color:'#5A5858'

  },
  button: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'black',
    height: 60,
    backgroundColor: '#FAFAFA',
  },
  button1: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'black',
    height: 60,
    backgroundColor: '#FAFAFA',
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
  },
  buttonText1: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    
  },
});

export default WelcomePage;