import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';




import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddRecipeScreen from '../screens/AddRecipeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Tab = createBottomTabNavigator();



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
  

export default MyTabs;