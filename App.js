import React, { useState } from 'react'; 
//pour gerer la navigation entre les pages
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';


import { Button, TextInput, StatusBar, StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native'; 
import { signUp, login } from './src/services/auth';

import SignUpScreen from './src/screens/SignUpScreen';




const Stack = createStackNavigator(); //pile de navigation, allez retour entre les pages

const Tab = createBottomTabNavigator();


//!=================================================================

//page d'accueil 
function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>ProfileScreen</Text>
    </View>
  );
}

function AddRecipeScreen() {
  return (
    <View style={styles.container}>
      <Text>AddRecipeScreen</Text>
    </View>
  );
}

function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text>FavoritesScreen</Text>
    </View>
  );
}

function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text>SearchScreen</Text>
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



export default function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Main" component={MyTabs}  options={{ headerShown: false }}  />
      </Stack.Navigator>

    </NavigationContainer>

  );
}

function MyTabs() {
  return (

    <Tab.Navigator
    screenOptions={({ route }) => ({
      
      tabBarIcon: ({ color, size }) => {
        
        let iconName;
        let iconSize = size;
        let iconColor = color;

        if (route.name === 'Home') {
          iconName = 'home';

        } else if (route.name === 'Profile') {
          
          iconName = 'person';
          

        } else if (route.name === 'New recipe') {
          iconName = 'create';
        }else if (route.name === 'Search') {
          iconName = 'search';
        }else if (route.name === 'Favorites') {
          iconName = 'star';
          iconColor = '#FFDD44';
        }

        return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
      },
    })}
  >

      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen name="New recipe" component={AddRecipeScreen} />

      <Tab.Screen name="Profile" component={ProfileScreen} />
      
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    
    </Tab.Navigator>

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
