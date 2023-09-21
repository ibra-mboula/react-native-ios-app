import React, { useState } from 'react'; 
//pour gerer la navigation entre les pages
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Button, TextInput, StatusBar, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native'; 
import { signUp, login } from './src/services/auth';



const Stack = createStackNavigator(); //pile de navigation, allez retour entre les pages


//page d'accueil 
function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Accueil</Text>
    </View>
  );
}



//!=================================================================
//page de connexion
function LoginScreen({ navigation }) {

// declaration des variables qui vont contenir les valeurs des champs de saisie
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

// fonction qui va permettre de creer un compte
  const handleSignUp = async () => {
    const result = await signUp(email, password);
    if (!result.success) {
      alert(result.error);
    } else {
      alert("User Created");
      navigation.navigate('Home');
    }
  }
  
// fonction qui va permettre de se connecter
  const handleLogin = async () => {
    const result = await login(email, password);

    if (!result.success) {
      alert(result.error);
    } else {
      alert("User Logged In");
      navigation.navigate('Home');
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
