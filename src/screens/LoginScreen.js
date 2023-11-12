import React, { useState, useContext  } from 'react'; 
//pour gerer la navigation entre les pages
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';


import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View, Button, StatusBar, Image } from 'react-native';
import { signUp, login } from '../services/auth';

import SignUpScreen from '../screens/SignUpScreen';

import { TouchableWithoutFeedback } from 'react-native';



function LoginScreen({ navigation }) {

 
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
    
    
      const handleSignUp = async () => {
        navigation.navigate('SignUp');
      }
      
    
      const handleLogin = async () => {
        const result = await login(email, password);
    
        if (!result.success) {
          alert(result.error);
        } else {
          
          navigation.navigate('Main');
        }
      }
    
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Text style={styles.title}>Bienvenue 👨🏾‍🍳</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <Button title="S'inscrire" onPress={handleSignUp} color="#D591FF" />
            <Button title="Se connecter" onPress={handleLogin} color="#32CD32" />
          </View>
          <StatusBar style="auto" />
        </KeyboardAvoidingView>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'flex-start', 
        paddingTop: 100,
        paddingHorizontal: 20, 
      },
      
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 50,
        color: '#22AED1',
      },
      input: {
        width: '80%',
        height: 40,
        borderColor: '#FFDEAD',
        borderWidth: 1,
        marginBottom: 40,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
      },
      buttonContainer: {
        width: '80%',
        justifyContent: 'space-between',
      },
    });
    


      export default LoginScreen;