import React, { useState,useContext  } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { signUp } from '../services/auth';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../services/firebaseConfig';
import UserContext from '../services/UserContext';


function SignUpScreen({ navigation }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setUser } = useContext(UserContext); 



    const handleSignUp = async () => {
        const emailToSave = email.toLowerCase();
        const result = await signUp(emailToSave, password);
        if (!result.success) {
            alert(result.error);
        } else {
            try {
                await addDoc(collection(db, "users"), {
                    name: name,
                    category: category,
                    email: emailToSave
                });
                setUser({
                    name: name,
                    category: category,
                    email: emailToSave
                });
                navigation.navigate('Login');
            } catch (error) {
                console.error("Erreur lors de l'enregistrement des données :", error);
                alert("Erreur lors de l'enregistrement des données : " + error.message);
            }
        }
        navigation.navigate('Login');
    };

    
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <TextInput placeholder="Nom" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Catégorie (végétarien ou non-végétarien)" value={category} onChangeText={setCategory} style={styles.input} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
          <TextInput placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#7f8c8d',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#ecf0f1',
  },
  button: {
    width: '40%',
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default SignUpScreen;
