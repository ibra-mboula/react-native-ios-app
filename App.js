// useState nous permet de garder une trace de l'utilisateur actuel
import React, { useState } from 'react'; 

// Ici, on s'occupe de la navigation
import { NavigationContainer } from '@react-navigation/native';

// createStackNavigator, c'est un peu notre GPS, il nous guide d'un écran à l'autre.
import { createStackNavigator } from '@react-navigation/stack';

//garde les infos de l'utilisateur, accessible partout dans l'app.
import UserContext from './src/services/UserContext';

//  on importe nos écrans.
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import MyTabs from './src/navigation/TabNavigator';

// On crée notre pile de navigation, pour lire dans un ordre précis.
const Stack = createStackNavigator();


export default function App() {
    // On garde une trace de notre utilisateur. Au départ, c'est comme une page blanche, d'où le null.
    const [user, setUser] = useState(null);

    //rendu de la page !
    return (
        // UserContext, pour partager l'état de l'utilisateur dans toute l'app.
        <UserContext.Provider value={{ user, setUser }}>
           
            <NavigationContainer>
                {/* Ici, c'est notre plan de navigation, on définit le chemin de nos écrans */}
                <Stack.Navigator initialRouteName="Login">
                    {/* Chaque Stack.Screen est comme une porte vers un nouvel écran */}
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    {/* MyTabs, c'est notre écran principal, sans en-tête pour plus de style ! */}
                    <Stack.Screen name="Main" component={MyTabs} options={{ headerShown: false }} />
                </Stack.Navigator>
                
            </NavigationContainer>
        </UserContext.Provider>
    );
}
