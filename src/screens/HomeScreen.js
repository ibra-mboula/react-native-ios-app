import React from 'react';
import { View, Text, StyleSheet } from 'react-native';



function HomeScreen() {
    return (
      <View style={styles.container}>
        <Text>HomeScreen</Text>
      </View>
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

export default HomeScreen;