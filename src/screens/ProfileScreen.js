import React, { useState } from 'react';
import { View,Text, TextInput, Button, StyleSheet } from 'react-native';
import { signUp } from '../services/auth';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../services/firebaseConfig';




function ProfileScreen() {
    return (
      <View style={styles.container}>
        <Text>ProfileScreen</Text>
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


export default ProfileScreen;