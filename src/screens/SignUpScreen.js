import React, { useState,useContext  } from 'react';
import { View, TextInput, Button, StyleSheet,ScrollView } from 'react-native';
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
                navigation.navigate('MyHome');
            } catch (error) {
                console.error("Erreur lors de l'enregistrement des données :", error);
                alert("Erreur lors de l'enregistrement des données : " + error.message);
            }
        }
        navigation.navigate('Login');
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
