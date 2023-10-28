import React, { useState } from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserContext from './src/services/UserContext';

import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import MyTabs from './src/navigation/TabNavigator';

import { AppRegistry,StyleSheet  } from 'react-native';


const Stack = createStackNavigator();

export default function App() {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="Main" component={MyTabs} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </UserContext.Provider>
    );
}
