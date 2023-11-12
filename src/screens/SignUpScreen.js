import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { signUp } from '../services/auth';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../services/firebaseConfig';
import UserContext from '../services/UserContext';

// Voici notre fonction SignUpScreen, avec la navigation en prop pour la navigation entre les écrans.
function SignUpScreen({ navigation }) {
    // On utilise useState pour gérer les états locaux des champs du formulaire.
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // On utilise useContext pour pouvoir définir l'utilisateur.
    const { setUser } = useContext(UserContext);

    // fonction pour gérer l'inscription.
    const handleSignUp = async () => {
        // On convertit l'email en minuscules pour assurer la cohérence
        const emailToSave = email.toLowerCase();

        // On appelle la fonction d'inscription de notre service d'authentification
        const result = await signUp(emailToSave, password);
        if (!result.success) {
            // En cas d'échec, on affiche une alerte.
            alert(result.error);
        } else {
            try {
                // On ajoute l'utilisateur dans la collection 'users' de Firestore
                await addDoc(collection(db, "users"), {
                    name: name,
                    category: category,
                    email: emailToSave
                });
                // On met à jour l'état de l'utilisateur dans le contexte
                setUser({
                    name: name,
                    category: category,
                    email: emailToSave
                });
                // navigue vers l'écran de connexion
                navigation.navigate('Login');
            } catch (error) {
                // En cas d'erreur lors de l'ajout dans Firestore, on affiche une alerte.
                console.error("Erreur lors de l'enregistrement des données :", error);
                alert("Erreur lors de l'enregistrement des données : " + error.message);
            }
        }
    };

    
  return (
    <KeyboardAvoidingView // Pour éviter que le clavier ne cache nos champs de saisie.
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          
          <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Catégory : veg or car" value={category} onChangeText={setCategory} style={styles.input} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
          <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
          
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
