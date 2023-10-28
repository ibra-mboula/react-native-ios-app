import React, { useState, useContext  } from 'react'; 
//pour gerer la navigation entre les pages
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';


import { Button, TextInput, StatusBar, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native'; 
import { signUp, login } from '../services/auth';

import SignUpScreen from '../screens/SignUpScreen';

import { TouchableWithoutFeedback } from 'react-native';


//page de connexion
function LoginScreen({ navigation }) {

    // declaration des variables qui vont contenir les valeurs des champs de saisie
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
    
    // fonction qui va permettre de creer un compte
      const handleSignUp = async () => {
        navigation.navigate('SignUp');
      }
      
    // fonction qui va permettre de se connecter
      const handleLogin = async () => {
        const result = await login(email, password);
    
        if (!result.success) {
          alert(result.error);
        } else {
          
          navigation.navigate('Main');
        }
      }
    
      return (
        // Comportement du déplacement vers le haut sur iOS, ajustement de la hauteur sur Android
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.container}
      >
      
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
         
          <Button title="S'inscrire" onPress={handleSignUp} />
          <Button title="Se connecter" onPress={handleLogin} />
          <StatusBar style="auto" />
    
        </KeyboardAvoidingView>
      );
    }

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        },

        input: {
      
          //ce bloc permet de creer des champs de saisie rectangulaire
          width: '80%',
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
          paddingHorizontal: 10,
          borderRadius: 10, 
      
        },
      });


      export default LoginScreen;