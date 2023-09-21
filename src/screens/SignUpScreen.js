import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { signUp } from '../services/auth';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../services/firebaseConfig';

function SignUpScreen({ navigation }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //ce qui se passe quand on clique sur le bouton s'inscrire
    const handleSignUp = async () => {
        const result = await signUp(email, password);
        if (!result.success) {
            alert(result.error);
        } else {
            // Ajout d'un nouvel utilisateur à Firestore sans spécifier d'ID
            try {
                await addDoc(collection(db, "users"), {
                    name: name,
                    category: category,
                    email: email
                });
                navigation.navigate('Home');
            } catch (error) {
                console.error("Erreur lors de l'enregistrement des données :", error);
                alert("Erreur lors de l'enregistrement des données : " + error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Nom"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="Catégorie (végétarien ou non-végétarien)"
                value={category}
                onChangeText={setCategory}
                style={styles.input}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="S'inscrire" onPress={handleSignUp} />
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
      width: '80%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      borderRadius: 10, 
    },
});

export default SignUpScreen;
