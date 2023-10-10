import React, { useState } from 'react'; 
//pour gerer la navigation entre les pages
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import MyTabs from './src/navigation/TabNavigator';

const Stack = createStackNavigator(); //pile de navigation, allez retour entre les pages


//!=================================================================



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


